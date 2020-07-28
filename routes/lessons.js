const express = require('express')
const router = express.Router()

const { User } = require('../models/user')
const { Deck } = require('../models/deck')
const { Question, validateQuestions, types } = require('../models/question')
const { Lesson } = require('../models/lesson')

const auth = require('../middleware/auth')
const exists = require('../middleware/exists')(Deck, 'deckId')
const validate = require('../middleware/validate')

const { shuffle, spaceArray } = require('../utils/arrayHelpers')

router.get('/:deckId/:index', [auth, exists], async (req, res) => {
  const { deckId } = req.params
  const { _id: userId } = req.user
  const index = req.params.index
  const deck = await Deck.findById(deckId).populate('cards', 'front back')
  const lesson = await Lesson.findOne({ user: userId, deck: deckId }).populate(
    'questions',
    'card correct'
  )
  const cardsCount = deck.cards.length

  let cards = []
  const deckCards = deck.cards
  const parsedIndex = parseInt(index)
  if (
    index !== 'training' &&
    (!Number.isInteger(parsedIndex) ||
      cardsCount < parsedIndex * 5 ||
      parsedIndex < 0)
  ) {
    return res.status(400).send('Invalid lesson index')
  } else if (index === 'training') {
    if (lesson) {
      const priority = []
      deckCards.forEach((card) => {
        const specificQuestions = lesson.questions.filter(
          (question) => question.card.toString() === card._id.toString()
        )
        const correctQuestions = specificQuestions.filter(
          (question) => question.correct
        ).length
        const incorrectQuestions = specificQuestions.filter(
          (question) => !question.correct
        ).length
        priority.push({
          _id: card._id,
          front: card.front,
          back: card.back,
          priority: correctQuestions - incorrectQuestions,
        })
      })
      priority.sort((first, second) => {
        if (first.priority > second.priority) {
          return 1
        } else if (second.priority > first.priority) {
          return -1
        } else {
          return 0
        }
      })
      console.table(priority)
      const highPriority = priority.slice(0, 3)
      console.table(highPriority)

      let randomCards = [...priority.slice(3, priority.length)]
      randomCards.sort(() => 0.5 - Math.random())
      randomCards = randomCards.slice(0, 2)
      console.table(randomCards)

      cards = [...highPriority, ...randomCards]
    } else {
      const randomCards = [...deckCards]
      randomCards.sort(() => 0.5 - Math.random())
      cards = randomCards.slice(0, 5)
    }
  } else {
    const numberOfCards = (parsedIndex + 1) * 5
    cards = deckCards.slice(
      parsedIndex * 5,
      numberOfCards > cardsCount ? cardsCount : numberOfCards
    )
    if (lesson) {
      cards.forEach((card) => {
        card._doc.new = !lesson.questions.some(
          (question) => question.card.toString() === card._id.toString()
        )
      })
    } else {
      cards.forEach((card) => {
        card._doc.new = true
      })
      console.log(JSON.stringify(cards, null, 2))
    }
  }
  const newCards = []
  let questions = []
  let writeQuestions = []
  const frontBackQuestions = []
  const backFrontQuestions = []
  for (const card of cards) {
    const { _id, front, back } = card
    const { new: newProp } = card._doc
    if (newProp) {
      newCards.push(card)
    }
    frontBackQuestions.push({
      _id,
      front,
      back,
      type: types.FRONT_BACK_TYPE,
      new: newProp,
    })
    backFrontQuestions.push({
      _id,
      back: front,
      front: back,
      type: types.BACK_FRONT_TYPE,
      new: newProp,
    })
  }
  writeQuestions.push(...frontBackQuestions, ...backFrontQuestions)
  writeQuestions = shuffle(writeQuestions)
  writeQuestions = spaceArray(writeQuestions)

  let standardQuestions = []
  let choiceQuestions = []
  const falseChoiceFrontBackQuestions = [...frontBackQuestions]
  const falseChoiceBackFrontQuestions = [...backFrontQuestions]

  newCards.forEach((newCard) => {
    const { _id, front, back } = newCard
    standardQuestions.push({
      _id,
      front,
      back,
      type: types.STANDARD_TYPE,
      new: true,
    })

    function falseChoiceGenerator(falseChoiceQuestions) {
      return falseChoiceQuestions
        .filter(
          (falseChoiceQuestion) =>
            falseChoiceQuestion._id.toString() !== newCard._id.toString()
        )
        .sort(() => 0.5 - Math.random())
        .slice(0, 2)
        .map((falseChoiceQuestion) => falseChoiceQuestion.back)
    }

    const randomFrontBackChoices = falseChoiceGenerator(
      falseChoiceFrontBackQuestions
    )
    const randomFrontBackIndex = Math.floor(Math.random() * 3)
    randomFrontBackChoices.splice(randomFrontBackIndex, 0, back)
    choiceQuestions.push({
      _id,
      front,
      back,
      choices: randomFrontBackChoices,
      type: types.CHOICE_TYPE,
      new: true,
    })

    const randomBackFrontChoices = falseChoiceGenerator(
      falseChoiceBackFrontQuestions
    )
    const randomBackFrontIndex = Math.floor(Math.random() * 3)
    randomBackFrontChoices.splice(randomBackFrontIndex, 0, front)
    choiceQuestions.push({
      _id,
      front: back,
      back: front,
      choices: randomBackFrontChoices,
      type: types.CHOICE_TYPE,
      new: true,
    })
  })

  standardQuestions = shuffle(standardQuestions)

  choiceQuestions = shuffle(choiceQuestions)
  choiceQuestions = spaceArray(choiceQuestions)

  questions.unshift(...standardQuestions, ...choiceQuestions, ...writeQuestions)

  console.table(questions)

  return res.status(200).send(questions)
})

router.post(
  '/:deckId',
  [auth, exists, validate(validateQuestions)],
  async (req, res) => {
    const { questions } = req.body
    const { deckId } = req.params
    const { _id: userId } = req.user

    const user = await User.findById(userId)
    let lesson = await Lesson.findOne({ user: userId, deck: deckId })
    if (!lesson) {
      lesson = new Lesson({ user: userId, deck: deckId })
      user.lessons.push(lesson)
      await user.save()
    }

    for (const questionBody of questions) {
      const question = new Question({
        ...questionBody,
        lesson: lesson._id,
      })

      await question.save()
      lesson.questions.push(question)
    }
    await lesson.save()

    return res.status(200).send(null)
  }
)

module.exports = router

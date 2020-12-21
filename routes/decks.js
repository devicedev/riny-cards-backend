const express = require('express')
const router = express.Router()

const { User } = require('../models/user')
const { Deck, validateCreate, validateUpdate } = require('../models/deck')
const { Card } = require('../models/card')
const { Lesson } = require('../models/lesson')

const auth = require('../middleware/auth')
const exists = require('../middleware/exists')(Deck)
const validate = require('../middleware/validate')
const deckBelongsToUser = require('../middleware/deckBelongsToUser')
const cardsBelongToDeck = require('../middleware/cardsBelongToDeck')

const {
  getLessonProgress,
  getLessonPartsProgress,
} = require('../utils/progress')

router.get('/', [auth], async (req, res) => {
  const { _id: userId } = req.user
  const decks = await Deck.find({ author: userId, deleted: false })
    .select('title description cards')
    .sort('-createdAt')
    .limit(50)
  const { lessons } = await User.findById(userId)
    .select('lessons')
    .populate({
      path: 'lessons',
      select: 'questions deck',
      populate: {
        path: 'questions',
        select: 'card correct',
      },
    })
  for (const deck of decks) {
    const { _id: deckId } = deck

    const lesson = lessons.find(
      (lesson) => lesson.deck.toString() === deckId.toString()
    )
    if (lesson) {
      const { questions } = lesson
      const { cards } = deck
      deck._doc.progress = getLessonProgress(questions, cards)
    }
  }
  return res.status(200).send(decks)
})

router.get('/:id', [auth, exists], async (req, res) => {
  const { id } = req.params
  const { _id: userId } = req.user
  const deck = await Deck.findById(id)
    .select('title description createdAt updatedAt')
    .populate('author', 'name')
    .populate('cards', 'front back')

  const lesson = await Lesson.findOne({ deck: id, user: userId }).populate(
    'questions',
    'card type correct createdAt updatedAt'
  )
  let questions = []
  const { cards } = deck
  if (lesson) {
    questions = lesson.questions
  }
  deck._doc.parts = getLessonPartsProgress(questions, cards)

  return res.status(200).send(deck)
})

router.post('/', [auth, validate(validateCreate)], async (req, res) => {
  const { title, description, cards } = req.body
  const { _id } = req.user
  const user = await User.findById(_id)
  const deck = new Deck({ title, description, author: _id })

  for (const cardField of cards) {
    const card = new Card({ ...cardField, decks: [deck._id] })
    deck.cards.push(card)
    await card.save()
  }
  const result = await deck.save()
  user.decks.push(deck)
  await user.save()

  return res.status(200).send(result)
})

router.put(
  '/:id',
  [
    auth,
    exists,
    validate(validateUpdate),
    deckBelongsToUser,
    cardsBelongToDeck,
  ],
  async (req, res) => {
    const { _id: authorId } = req.user
    const { id } = req.params

    const { title, description, cards: bodyCards } = req.body
    const deck = await Deck.findById(id)
    deck.title = title
    deck.description = description

    const deckCards = [...deck.cards]
    const oldCards = bodyCards.filter((bodyCard) => bodyCard._id)
    for (const oldCard of deckCards) {
      const find = oldCards.find(
        (bodyCard) => bodyCard._id === oldCard.toString()
      )
      if (!find) {
        await Card.findByIdAndRemove(oldCard)
        deck.cards.pull(oldCard)
      } else {
        const { _id, front, back } = find
        await Card.findByIdAndUpdate(_id, { front, back }, { new: true })
      }
    }

    const newCards = bodyCards.filter((bodyCard) => !bodyCard._id)
    for (const newCardBody of newCards) {
      const { front, back } = newCardBody
      const newCard = new Card({
        front,
        back,
        author: authorId,
        decks: [deck._id],
      })
      await newCard.save()
      deck.cards.push(newCard)
    }
    await deck.save()
    return res.status(200).send(deck)
  }
)

router.delete('/:id', [auth, exists, deckBelongsToUser], async (req, res) => {
  const { id } = req.params
  const deck = await Deck.findById(id).populate('cards')
  for (const card of deck.cards) {
    await card.remove()
  }

  const lessons = await Lesson.find({ deck: id }).populate('questions')
  for (const lesson of lessons) {
    for (const question of lesson.questions) {
      await question.remove()
    }
    await lesson.remove()
  }

  await deck.remove()
  return res.status(200).send(deck)
})

module.exports = router

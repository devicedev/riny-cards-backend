const express = require('express')
const router = express.Router()

const { Deck } = require('../models/deck')
const { types } = require('../models/question')

const auth = require('../middleware/auth')
const exists = require('../middleware/exists')(Deck, 'deckId')

const { shuffle, spaceArray } = require('../utils/arrayHelpers')

router.get('/:deckId/:index', [auth, exists], async (req, res) => {
  const { deckId } = req.params
  const index = parseInt(req.params.index)
  const deck = await Deck.findById(deckId).populate('cards', 'front back')
  const cardsCount = deck.cards.length

  if (index > cardsCount * 5)
    return res.status(400).send('Invalid lesson index')

  let questions = []
  const cards = deck.cards.slice(index * 5, (index + 1) * 5)
  for (const card of cards) {
    const { _id, front, back } = card
    questions.push(
      { _id, front, back, type: types.FRONT_BACK_TYPE },
      { _id, back: front, front: back, type: types.BACK_FRONT_TYPE }
    )
  }
  questions = shuffle(questions)
  questions = spaceArray(questions)
  return res.status(200).send(questions)
})

router.post('/:deckId', [auth, exists], async (req, res) => {
  const { deckId } = req.params
  const deck = await Deck.findById(deckId)
  return res.status(200).send('Ok')
})

module.exports = router

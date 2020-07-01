const express = require('express')
const router = express.Router()

const { Deck } = require('../models/deck')

const auth = require('../middleware/auth')
const exists = require('../middleware/exists')(Deck, 'deckId')

router.get('/:deckId/:lessonIndex', [auth, exists], async (req, res) => {
  const { deckId } = req.params
  const lessonIndex = parseInt(req.params.lessonIndex)
  const deck = await Deck.findById(deckId).populate('cards')
  const lesson = deck.cards.slice(lessonIndex * 5, (lessonIndex + 1) * 5)
  return res.status(200).send(lesson)
})
module.exports = router

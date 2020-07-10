const express = require('express')
const router = express.Router()

const { User } = require('../models/user')
const { Deck, validate } = require('../models/deck')
const { Card } = require('../models/card')
const auth = require('../middleware/auth')
const exists = require('../middleware/exists')(Deck)

router.get('/', [auth], async (req, res) => {
  const { _id } = req.user
  const decks = await Deck.find({
    author: { _id },
    deleted: false,
  }).sort('-createdAt')
  return res.status(200).send(decks)
})

router.get('/:id', [auth, exists], async (req, res) => {
  const { id } = req.params
  const deck = await Deck.findById(id).populate('cards')
  return res.status(200).send(deck)
})

router.post('/', [auth], async (req, res) => {
  const body = req.body
  const { error } = validate(body)
  if (error) return res.status(400).send(error.details[0].message)

  const { title, description, cards } = body
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
router.put('/:id', [auth, exists], async (req, res) => {
  const { id } = req.params
  const body = req.body
  const { error } = validate(body)
  if (error) return res.status(400).send(error.details[0].message)

  const { title, description } = body
  const deck = await Deck.findByIdAndUpdate(id, { title, body }, { new: true })
  console.log(deck)
})

router.delete('/:id', [auth, exists], async (req, res) => {
  const { id } = req.params
  const deck = await Deck.findById(id).populate('cards')
  for (const card of deck.cards) {
    await card.remove()
  }
  await deck.remove()
  return res.status(200).send(deck)
})

module.exports = router

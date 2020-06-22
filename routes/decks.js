const express = require('express')
const router = express.Router()

const { User } = require('../models/user')
const { Deck, validate } = require('../models/deck')
const { Card } = require('../models/card')
const auth = require('../middleware/auth')
const exists = require('../middleware/exists')(Deck)

router.get('/', [auth], async (req, res) => {
  const { _id } = req.user
  const { decks } = await User.findById(_id)
    .populate('decks')
    .sort([['updatedAt', 'ascending']])
  return res.status(200).send(decks)
})

router.get('/:id', [exists], async (req, res) => {
  const { id } = req.params
  const deck = await Deck.findById(id).populate('cards')
  return res.status(200).send(deck)
})

router.post('/', [auth], async (req, res) => {
  const body = req.body
  const { error } = validate(body)

  if (error) return res.status(400).send(error.details[0].message)

  const deck = new Deck({ ...body })
  const result = await deck.save()

  return res.status(200).send(result)
})

module.exports = router

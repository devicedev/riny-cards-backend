const express = require('express')
const router = express.Router()

const {Deck, validate} = require('../models/deck')
const {Card} = require('../models/card')

router.get('/', async (req, res) => {
  const decks = await Deck.find().sort([['updatedAt', 'ascending']])
  return res.send(decks)
})

router.post('/', async (req, res) => {
  const body = req.body
  const {error} = validate(body)

  if (error) return res.status(400).send(error.details[0].message)

  const deck = new Deck({...body})
  const result = await deck.save()

  return res.status(200).send(result)
})

module.exports = router
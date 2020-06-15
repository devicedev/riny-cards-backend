const mongoose = require('mongoose')
const Joi = require('@hapi/joi')

const deckSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 1,
    maxlength: 255,
    trim: true,
    required: true
  },
  description: {
    type: String,
    minlength: 1,
    maxlength: 500,
    trim: true,
    required: true
  },
  language: {
    type: String,
    minlength: 1,
    maxlength: 255,
    trim: true,
    required: true,
    default: 'en'
  },
  coverImage: String,
  cards: [{ type: mongoose.Schema.ObjectId, ref: 'Card' }],
  deleted: Boolean,
  imported: Boolean
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

const joiSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().min(1).max(500).required()
})

const validate = (deck) => joiSchema.validate(deck)

const Deck = mongoose.model('Deck', deckSchema)

module.exports = { Deck, validate }
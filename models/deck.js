const mongoose = require('mongoose')
const Joi = require('@hapi/joi')
const { cardJoiSchema } = require('./card')

const deckSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minlength: 1,
      maxlength: 255,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      minlength: 0,
      maxlength: 500,
      trim: true,
      required: false,
    },
    language: {
      type: String,
      minlength: 1,
      maxlength: 255,
      trim: true,
      required: true,
      default: 'en',
    },
    coverImage: String,
    cards: [{ type: mongoose.Schema.ObjectId, ref: 'Card' }],
    author: { type: mongoose.Schema.ObjectId, ref: 'User' },
    deleted: {
      type: Boolean,
      default: false,
    },
    imported: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
)

const joiSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().max(500).allow('').optional(),
  cards: Joi.array().items(cardJoiSchema).min(1).required(),
})
const validate = (deck) => joiSchema.validate(deck)

const Deck = mongoose.model('Deck', deckSchema)

module.exports = { Deck, validate }

const mongoose = require('mongoose')
const Joi = require('@hapi/joi')
const {
  joiSchemaCreate: cardJoiSchemaCreate,
  joiSchemaUpdate: cardJoiSchemaUpdate,
} = require('./card')

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
      maxlength: 255,
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

const Deck = mongoose.model('Deck', deckSchema)

const createJoiSchema = (cardJoiSchema) =>
  Joi.object({
    title: Joi.string().min(1).max(255).required(),
    description: Joi.string().max(255).allow('').optional(),
    cards: Joi.array().items(cardJoiSchema).min(1).required(),
  })

const joiSchemaCreate = createJoiSchema(cardJoiSchemaCreate)
const validateCreate = (deck) => joiSchemaCreate.validate(deck)

const joiSchemaUpdate = createJoiSchema(cardJoiSchemaUpdate)
const validateUpdate = (deck) => joiSchemaUpdate.validate(deck)

module.exports = { Deck, validateCreate, validateUpdate }

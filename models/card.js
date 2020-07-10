const mongoose = require('mongoose')
const Joi = require('@hapi/joi')

const cardSchema = new mongoose.Schema(
  {
    front: {
      type: String,
      required: true,
      min: 1,
      max: 255,
      trim: true,
    },
    back: {
      type: String,
      required: true,
      min: 1,
      max: 255,
      trim: true,
    },
    decks: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Deck',
      },
    ],
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
)

const joiSchema = Joi.object({
  front: Joi.string().min(1).max(255).required(),
  back: Joi.string().min(1).max(255).required(),
})
const validate = (card) => joiSchema.validate(card)

const Card = mongoose.model('Card', cardSchema)

module.exports = {
  Card,
  validate,
  cardJoiSchema: joiSchema,
}

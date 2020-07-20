const mongoose = require('mongoose')
const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)

const cardSchema = new mongoose.Schema(
  {
    front: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 250,
      trim: true,
    },
    back: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 250,
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
const Card = mongoose.model('Card', cardSchema)

const joiSchemaCreate = Joi.object({
  front: Joi.string().min(1).max(250).required(),
  back: Joi.string().min(1).max(250).required(),
})
const joiSchemaUpdate = Joi.object({
  _id: Joi.objectId(),
  front: Joi.string().min(1).max(250).required(),
  back: Joi.string().min(1).max(250).required(),
})

module.exports = {
  Card,
  joiSchemaCreate,
  joiSchemaUpdate,
}

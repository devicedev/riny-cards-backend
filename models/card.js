const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
  front: {
    type: String,
    required: true,
    min: 1,
    max: 255,
    trim: true
  },
  back: {
    type: String,
    required: true,
    min: 1,
    max: 255,
    trim: true
  },
  decks: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Deck'
    }
  ]
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

const Card = mongoose.model('Card', cardSchema)

module.exports = {
  Card
}
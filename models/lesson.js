const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    deck: { type: mongoose.Schema.ObjectId, ref: 'Deck', required: true },
    questions: [{ type: mongoose.Schema.ObjectId, ref: 'Question' }],
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
)
const Lesson = mongoose.model('Lesson', schema)

module.exports = {
  Lesson,
}

const mongoose = require('mongoose')
const Joi = require('@hapi/joi')

const CHOICE_TYPE = 'CHOICE'
const FRONT_BACK_TYPE = 'FRONT_BACK'
const BACK_FRONT_TYPE = 'BACK_FRONT'

const types = Object.freeze({ CHOICE_TYPE, FRONT_BACK_TYPE, BACK_FRONT_TYPE })

const schema = new mongoose.Schema(
  {
    card: { type: mongoose.Schema.ObjectId, ref: 'Card', required: true },
    lesson: { type: mongoose.Schema.ObjectId, ref: 'Lesson', required: true },
    type: {
      type: String,
      required: true,
    },
    correct: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
)
const Question = mongoose.model('Question', schema)

const validate = (question) => joiSchema.validate(question)
const joiSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(types))
    .required(),
})

module.exports = {
  Question,
  validate,
  types,
}

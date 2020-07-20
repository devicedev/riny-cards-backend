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

const joiSchema = Joi.object({
  questions: Joi.array()
    .items({
      card: Joi.objectId().required(),
      type: Joi.string()
        .valid(...Object.values(types))
        .required(),
      correct: Joi.boolean().required(),
    })
    .min(1)
    .required(),
})
const validateQuestions = (questions) => joiSchema.validate(questions)

module.exports = {
  Question,
  types,
  validateQuestions,
}

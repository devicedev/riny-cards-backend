const mongoose = require('mongoose')
const Joi = require('@hapi/joi')
const passwordComplexity = require('joi-password-complexity')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 1,
      maxlength: 50,
      required: true,
    },
    email: {
      type: String,
      minlength: 5,
      maxlength: 255,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minlength: 5,
      maxlength: 1024,
      required: true,
    },
    decks: [{ type: mongoose.Schema.ObjectId, ref: 'Deck' }],
    lessons: [{ type: mongoose.Schema.ObjectId, ref: 'Lesson' }],
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
)

userSchema.methods.generateAuthToken = function () {
  const { _id, name, email } = this
  return jwt.sign({ _id, name, email }, process.env.JSON_WEB_TOKEN_SECRET)
}

const User = mongoose.model('User', userSchema)

const registerSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  email: Joi.string().email().min(5).max(255).required(),
  password: passwordComplexity({
    min: 5,
    max: 50,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 0,
    requirementCount: 3,
  }).required(),
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

const validateRegister = (user) => registerSchema.validate(user)

const validateLogin = (user) => loginSchema.validate(user)

module.exports = {
  userSchema,
  User,
  validateRegister,
  validateLogin,
}

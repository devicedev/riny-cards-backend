const express = require('express')
const auth = require('../routes/auth')
const users = require('../routes/users')
const decks = require('../routes/decks')
const lessons = require('../routes/lessons')
const error = require('../middleware/error')

module.exports = (app) => {
  app.use(express.json())
  app.use('/api/auth', auth)
  app.use('/api/users', users)
  app.use('/api/decks', decks)
  app.use('/api/lessons', lessons)
  app.use(error)
}

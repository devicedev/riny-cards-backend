const express = require('express');
const decks = require('../routes/decks');
const users = require('../routes/users');
const auth = require('../routes/auth');

module.exports = (app) => {
  app.use(express.json());
  app.use('/api/auth', auth);
  app.use('/api/users', users);
  app.use('/api/decks', decks);
};
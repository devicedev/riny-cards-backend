const express = require('express');
const decks = require('../routes/decks');

module.exports = (app) => {
  app.use(express.json());

  app.use('/api/decks', decks);
};
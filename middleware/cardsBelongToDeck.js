const { Deck } = require('../models/deck')

module.exports = async (req, res, next) => {
  const { id } = req.params
  const deck = await Deck.findById(id)
  const cardsBody = req.body.cards.filter((card) => card._id)
  for (const cardBody of cardsBody) {
    const find = deck.cards.find((card) => card.toString() === cardBody._id)
    if (!find)
      return res.status(403).send('You do not have access to the given card')
  }
  next()
}

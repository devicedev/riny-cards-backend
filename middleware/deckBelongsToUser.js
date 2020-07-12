const { User } = require('../models/user')

module.exports = async (req, res, next) => {
  const { id: deckId } = req.params
  const { _id: userId } = req.user
  const user = await User.findById(userId)
  const find = user.decks.find((deck) => deck.toString() === deckId)
  if (!find) {
    return res.status(403).send('You do not have access to the given deck')
  } else {
    next()
  }
}

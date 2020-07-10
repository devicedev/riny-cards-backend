const error = (err, req, res, next) => {
  return res.status(500).send('Something failed.')
}
module.exports = error

module.exports = (Model, idName = 'id') => async (req, res, next) => {
  try {
    const id = req.params[idName]
    await Model.findById(id)
  } catch (e) {
    return res
      .status(404)
      .send(`${Model.modelName} with the given id was not found`)
  }
  next()
}

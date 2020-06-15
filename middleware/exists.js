const exists = Model => async (req, res, next) => {
  try {
    await Model.findById(req.params.id);
  } catch (e) {
    return res
      .status(404)
      .send(`${Model.modelName} with the given id was not found`);
  }
  next();
};
module.exports = exists;

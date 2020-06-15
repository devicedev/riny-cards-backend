const mongoose = require('mongoose')

module.exports = () => {
  const {DB_NAME, DB_PASSWORD} = process.env
  const dbURI = `mongodb+srv://root:${DB_PASSWORD}@riny-cards-oldde.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
  const options = {useNewUrlParser: true, useUnifiedTopology: true}
  mongoose.connect(dbURI, options)
    .then(() => console.log(`Connected to ${DB_NAME} database`))
    .catch(err => console.error(err))
}
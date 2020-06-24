const mongoose = require('mongoose')

module.exports = () => {
  const { DB_NAME, DB_URI } = process.env
  const options = { useNewUrlParser: true, useUnifiedTopology: true }
  mongoose
    .connect(DB_URI, options)
    .then(() => console.log(`Connected to ${DB_NAME} database`))
    .catch((err) => console.error(err))
}

require('dotenv').config()
const express = require('express')
const app = express();

require('./startup/middlewares')(app);
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

module.exports = server;
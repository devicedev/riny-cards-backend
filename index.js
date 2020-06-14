const express = require('express')
const app = express();

require('./startup/routes')(app);

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

module.exports = server;
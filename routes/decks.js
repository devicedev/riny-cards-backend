const express = require('express')
const router = express.Router()

router.get('/',/* auth ,*/((req, res) => {
  return res.send("Hello Riny Cards");
}))

module.exports = router;
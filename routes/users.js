const express = require('express')
const router = express.Router()
const _ = require('lodash')
const bcrypt = require('bcrypt')

const { User, validateRegister } = require('../models/user')

router.post('/', async (req, res) => {
  const body = req.body
  const { error } = validateRegister(body)
  if (error) return res.status(400).send(error.details[0].message)

  let user = await User.findOne({ email: body.email })
  if (user) return res.status(400).send('The given email address is already used')

  const salt = await bcrypt.genSalt(10)
  user = new User(_.pick(body, ['name', 'email', 'password']))
  user.password = await bcrypt.hash(user.password, salt)
  await user.save()

  const token = user.generateAuthToken()
  return res
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .send(_.pick(user, ['_id', 'name', 'email']))
})

module.exports = router

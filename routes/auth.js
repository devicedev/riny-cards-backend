const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');

const {User, validateLogin} = require('../models/user');

router.post('/', async (req, res) => {
    const body = req.body;
    const {error} = validateLogin(body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({email: body.email});
    if (!user) return res.status(400).send('Invalid email or password.');
    const validPassword = await bcrypt.compare(body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();
    return res.send({token});
});

module.exports = router;
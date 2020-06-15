const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JSON_WEB_TOKEN_SECRET;

const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided.');
    try {
        req.user = jwt.verify(token, jwtSecret);
        next();
    } catch (ex) {
        return res.status(400).send('Invalid token.')
    }
};
module.exports = auth;
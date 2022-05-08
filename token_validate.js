const jwt = require('jsonwebtoken');
const secret = process.env.WEB_TOKEN_SECRET

// verify a token
const verifyToken = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ error: 'Access Denied' });
        }
        // extract the token from the request
        let token = req.headers.authorization

        // verify token
        const verify = jwt.verify(token, secret);
        req.user = verify;
        next();
    } catch (err) {
        // if invalid token handle throwed error
        res.status(403).json({ error: 'invalid token' });
    }
}


module.exports = verifyToken;

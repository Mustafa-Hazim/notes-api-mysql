const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
const User = require('../models/users')

const secret = process.env.WEB_TOKEN_SECRET

const getAll = ('/', (req, res) => {
    User.getAll((err, result) => {
        if (err) res.send(err)
        else res.json(result)
    })
})

const register = ('/register', (req, res) => {

    // extract the data from the request
    const data = req.body

    // bcrypt password: 
    var salt = bcrypt.genSaltSync(10);
    data.password = bcrypt.hashSync(data.password, salt);

    // register user : 
    User.findByEmail(req.body.email, (err, result) => {
        // check if errors 
        if (err) res.status(500).json(err)
        // check if the user already registerd
        else if (result.length > 0) res.status(400).json({ error: 'user alrady registerd' })
        // register user 
        else {
            //todo create userCard:

            //create new user object:
            const user = new User({
                //todo add userCard id:
                email: data.email,
                password: data.password,
                verified: 0
            })

            // save user to the data base:
            user.save((err, result) => {
                if (err) return res.status(400).json(err)

                res.json({ msg: 'user registerd contact the admin to activate your account at hazim6163@gmail.com' })
            })
        }
    })


})

const login = ('/login', (req, res) => {
    User.findByEmail(req.body.email, (err, result) => {
        // check database error 
        if (err) return res.status(401).json(err)

        // invalid email: 
        if (result.length === 0) return res.status(400).json({ error: 'user cannot be found' })

        // extract the user form the result 
        const user = result[0]

        // compare passwords 
        const valid = bcrypt.compareSync(req.body.password, user.password);
        // wrong password
        if (!valid) return res.status(401).json({ error: 'check the email and the password' })
        // check if verify account: 
        if (!user.verified) return res.status(401).json({ error: 'please contact the admin to activate your account at hazim6163@gmail.com' })
        // sign webtoken where expiresIn in seconds
        var token = jwt.sign({ id: user.id }, secret, { expiresIn: 86400 });

        res.json({ token })

    })

})



const status = ('/status', (req, res) => {
    res.send(req.user)
})



module.exports = {
    getAll,
    register,
    login,
    status,
}
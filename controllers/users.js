const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
const User = require('../models/users')
const UserCard = require('../models/userCards')

const secret = process.env.WEB_TOKEN_SECRET

const getAll = ('/', (req, res) => {
    User.getAll((err, result) => {
        if (err) res.send(err)
        else res.json(result)
    })
})

/**
 * extract the data from the usesr request
 * create bcrypt password
 * check if the user already registered
 * create usercard
 * save user card without the user id
 * create uesr object 
 * save user to the database
 * append usercard with the inserted user id 
 * send response back to the user
 */
const register = ('/register', (req, res) => {

    // extract the data from the request
    const data = req.body

    // bcrypt password: 
    var salt = bcrypt.genSaltSync(10);
    data.password = bcrypt.hashSync(data.password, salt);

    // register user : 
    User.findByEmail(req.body.email, (err, result) => {
        // check if errors 
        if (err) res.status(500).json({ error: err, errMsg: 'internal server error' })
        // check if the user already registerd
        else if (result.length > 0) res.status(400).json({ error: 'user alrady registerd' })
        // register user 
        else {
            //create userCard:
            const userCard = new UserCard({
                fname: data.fname,
                lname: data.lname,
                email: data.email
            })
            // save user card to the database : 
            userCard.save((err, userCardResult) => {
                if (err) return res.status(500).json({ error: err, errMsg: 'internal server error when save the user card in the register controller' })
                else {
                    //create new user object:
                    const user = new User({
                        userCard: userCardResult.id,
                        email: data.email,
                        password: data.password,
                        verified: 0
                    })
                    // save user to the data base:
                    user.save((err, userResult) => {
                        if (err) return res.status(500).json({ error: err, errMsg: 'internal server error when save user in the register controller' })
                        // append usercard with the inserted user :
                        UserCard.updateUserIdById({ id: userCardResult.id, userID: userResult.id }, (err, updateUserCardResult) => {
                            if (err) return res.status(500).json({ error: err, errMsg: 'internal server error 500 when update user card register controller' })
                            // send successful response to the user: 
                            else return res.json({ msg: 'user registerd contact the admin to activate your account at hazim6163@gmail.com' })
                        })

                    })
                }
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

        // get user card: 
        UserCard.getByUserID(user.id, (err2, result2) => {
            if (err2) return res.json({ err2 })
            res.json({ token, userCard: result2[0] })
        })


    })

})



const status = ('/status', (req, res) => {
    // get user card: 
    UserCard.getByUserID(req.user.id, (err2, result2) => {
        if (err2) return res.json({ err2 })
        res.json({ userCard: result2[0] })
    })
})



module.exports = {
    getAll,
    register,
    login,
    status,
}
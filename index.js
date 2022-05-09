require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users')
const tagsRoutes = require('./routes/tags')

// create express app
const app = express();

//use body-parser:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

// routes: 
app.use('/users', userRoutes)
app.use('/tags', tagsRoutes)


app.get('/', (req, res, next) => {
    res.send('app working fine')
})

// create port 
const port = process.env.PORT || 3000
// starting the server 
app.listen(port, () => {
    console.log('server running on: ' + port)
});

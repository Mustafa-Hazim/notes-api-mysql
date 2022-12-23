require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users')
const tagsRoutes = require('./routes/tags')
const peopleRoutes = require('./routes/people')
const groupsRoutes = require('./routes/groups')
const branchesRoutes = require('./routes/branches')

// create express app
const app = express();

const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://3.120.11.152:8867'
    ]
}

// user cors : 
app.use(cors(corsOptions))

//use body-parser:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

// routes: 
app.use('/users', userRoutes)
app.use('/tags', tagsRoutes)
app.use('/people', peopleRoutes)
app.use('/groups', groupsRoutes)
app.use('/branches', branchesRoutes)


app.get('/', (req, res, next) => {
    res.send('notes app')
})

// create port 
const port =  3001
// starting the server 
app.listen(port, () => {
    console.log('server running on: ' + port)
});

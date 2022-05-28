const Person = require('../models/people')
/**
 * add to add new person
 * edit to edit one tag required new fname and lname and the person id
 * get all to get all people
 * get person branches getPersonBranches
 * delete person : deletePerson
 */
const add = ('/', (req, res) => {
    if (!req.body.fname) return res.status(400).json({ error: { message: 'the first name is required' } })

    // extract the data
    const data = req.body
    data.user = req.user.id

    // create person object: 
    const person = new Person(data)

    // save person to the database :
    person.save((err, result) => {
        if (err) return res.status(500).json(err)
        return res.json(result)
    })
})

const edit = ('/', (req, res) => {
    if (!req.body.fname || !req.body.id) return res.status(400).json({ error: { message: 'first name and id is required' } })
    // update person name by id function 
    Person.updateNameById(req.body.id, req.body.fname, req.body.lname, (err, result) => {
        if (err) return res.status(500).json(err)
        if (result.affectedRows > 0) return res.json({ edited: true, fname: req.body.fname, lname: req.body.lname })
        return res.json({ edited: false, msg: 'person cannot be found' })
    })
})

const getAll = ('/', (req, res) => {
    Person.getAll(req.user.id, (err, result) => {
        if (err) return res.status(500).json(err)
        res.json(result)
    })
})



// to get all person branches
const getPersonBranches = ('/', (req, res, next) => {
    if (!req.query.id) return next()
    Person.getPersonBranches(req.query.id, (err, result) => {
        if (err) return res.status(500).json(err)
        result = parseArrExtra(result)
        return res.json(result)
    })
})


// search person by name:
const SearchPersonByName = ('/search', (req, res) => {
    if (req.query.q.length <= 0) return Person.getAll(req.user.id, (err, result) => res.json(result))
    if (!req.query.q) return res.status(400).json({ error: 'need q query' })
    Person.searchPersonByName(req.query.q, (err, result) => {
        if (err) return res.status(500).json({ error: err })
        res.json(result)
    })
})

// delete person by id: 
const deletePerson = ('/', (req, res) => {
    if (!req.query.id) return res.status(400).json({ error: 'need id in query to delete' })
    Person.deletePerson(req.query.id, (err, result) => {
        res.json(result)
    })
})





// functoin to parse branch extra
function parseArrExtra(result) {
    result = result.map((b) => {
        b.extra = JSON.parse(b.extra)
        return b
    })
    return result
}



module.exports = {
    add,
    edit,
    getAll,
    getPersonBranches,
    SearchPersonByName,
    deletePerson,
}
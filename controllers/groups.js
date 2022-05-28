const Group = require('../models/groups')
/**
 * add to add new group
 * edit to edit one group required new name as name and the group id
 * get all to get all the group
 * get all group branches getGroupBranches
 * 
 * search group by name: SearchGroupByName
 * 
 * delete group by id deleteGroup
 */
const add = ('/', (req, res) => {
    if (!req.body.name) return res.status(400).json({ error: { message: 'name is required' } })

    // extract the data
    const data = req.body
    data.user = req.user.id

    // create group object: 
    const group = new Group(data)

    // save group to the database :
    group.save((err, result) => {
        if (err) return res.status(500).json(err)
        return res.json(result)
    })
})

const edit = ('/', (req, res) => {
    if (!req.body.name || !req.body.id) return res.status(400).json({ error: { message: 'group name and id is required' } })
    // update group name by id function 
    Group.updateNameDescById(req.body.id, req.body.name, req.body.description, (err, result) => {
        if (err) return res.status(500).json(err)
        if (result.affectedRows > 0) return res.json({ edited: true, name: req.body.name, description: req.body.description })
        return res.json({ edited: false, msg: 'tag cannot be found' })
    })
})

const getAll = ('/', (req, res) => {
    Group.getAll(req.user.id, (err, result) => {
        if (err) return res.status(500).json(err)
        res.json(result)
    })
})

// to get all group branches
const getGroupBranches = ('/', (req, res, next) => {
    if (!req.query.id) return next()
    Group.getGroupBranches(req.query.id, (err, result) => {
        if (err) return res.status(500).json(err)
        result = parseArrExtra(result)
        return res.json(result)
    })
})

const SearchGroupByName = ('/search', (req, res) => {
    if (req.query.q.length <= 0) return Group.getAll(req.user.id, (err, result) => res.json(result))
    if (!req.query.q) return res.status(400).json({ error: 'need q query' })
    Group.searchGroupByName(req.query.q, (err, result) => {
        if (err) return res.status(500).json({ error: err })
        res.json(result)
    })
})



// delete group by id: 
const deleteGroup = ('/', (req, res) => {
    if(!req.query.id) return res.status(400).json({error: 'need id in query to delete'})
    Group.deleteGroup(req.query.id, (err, result) => {
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
    getGroupBranches,
    SearchGroupByName,
    deleteGroup,
}
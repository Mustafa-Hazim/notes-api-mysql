const Group = require('../models/groups')
/**
 * add to add new group
 * edit to edit one group required new name as name and the group id
 * get all to get all the group
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

module.exports = {
    add,
    edit,
    getAll
}
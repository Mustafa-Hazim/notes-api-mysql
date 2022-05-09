const Tag = require('../models/tags')
/**
 * add to add new tag
 * edit to edit one tag required new name as name and the tag id
 * get all to get all the tags
 */
const add = ('/', (req, res) => {
    if (!req.body.name) return res.status(400).json({ error: { message: 'the tag name is required' } })

    // extract the data
    const data = req.body
    data.user = req.user.id

    // create tag object: 
    const tag = new Tag(data)

    // save tag to the database :
    tag.save((err, result) => {
        if (err) return res.status(500).json(err)
        return res.json(result)
    })
})

const edit = ('/', (req, res) => {
    if (!req.body.name || !req.body.id) return res.status(400).json({ error: { message: 'tag name and id is required' } })
    // update tag name by id function 
    Tag.updateNameById(req.body.id, req.body.name, (err, result) => {
        if (err) return res.status(500).json(err)
        if (result.affectedRows > 0) return res.json({ edited: true, name: req.body.name })
        return res.json({ edited: false, msg: 'tag cannot be found' })
    })
})

const getAll = ('/', (req, res) => {
    Tag.getAll(req.user.id, (err, result) => {
        if (err) return res.status(500).json(err)
        res.json(result)
    })
})

module.exports = {
    add,
    edit,
    getAll
}
const Branch = require('../models/branches')
/**
 * add new branch
 *      - exract the data from the request
 *      - check if the request for root branch parent
 *          -   get the root branch id for the user
 *          -   get current position
 *          -   set new branch position
 *          -   create branch and save it 
 *          -   parse json for the extra text
 *      - if the request if not for the root parent: 
 *          -   get branch position
 *          -   set new position
 *          -   create branch object and save it
 *          -   parse json for the extra text
 *  
 * edit to edit one branch required new name as name and the branch id
 * get all to get all the branch
 * 
 * getNested: 
 *      to get all nested branches for branch by id
 */
const add = ('/', (req, res) => {
    if (!req.body.name) return res.status(400).json({ error: { message: 'the tag name is required' } })

    // extract the data
    const data = req.body
    data.user = req.user.id
    // check if parent or root 
    if (data.parentID === 'root' || !data.parentID || data.parentID == 0) {
        // get the root branch id for the user: 
        Branch.getRootId(data.user, (parentID) => {
            data.parentID = parentID
            // get branch position:
            Branch.getMaxPosition(data.parentID, (crntPosition) => {
                //set new branch position
                data.position = crntPosition + 1

                // create branch object: 
                const branch = new Branch(data)
                // save branch to the database :
                branch.save((err, result) => {
                    // handle error 
                    if (err) return res.json(err)
                    // parse extra json: 
                    if (result.extra)
                        result.extra = JSON.parse(result.extra)
                    return res.json(result)
                })

            })
        })
    } else {
        // get branch position:
        Branch.getMaxPosition(data.parentID, (crntPosition) => {
            //set new branch position
            data.position = crntPosition + 1

            // create branch object: 
            const branch = new Branch(data)
            // save branch to the database :
            branch.save((err, result) => {
                // handle error 
                if (err) return res.json(err)
                // parse extra json: 
                if (result.extra)
                    result.extra = JSON.parse(result.extra)
                return res.json(result)
            })
        })
    }
})

// send some data to update the branch: 
const edit = ('/', (req, res) => {
    if (!req.body.id) return res.status(400).json({ error: { message: 'id is required' } })
    // update branch by id function 
    const data = req.body
    // get old branch data: 
    Branch.getById(data.id, (err, branch) => {
        branch = branch[0]
        // get new branch position: 
        Branch.getMaxPosition(data.parentID, (crntPosition) => {
            branch.position = crntPosition + 1
            // update the data in the branch: 
            branch = updateData(data, branch)

            Branch.updateById(branch, (err, result) => {
                if (err) return res.status(500).json(err)
                if (result.affectedRows > 0) return res.json({ edited: true, id: req.body.id, name: req.body.name })
                return res.json({ edited: false, msg: 'branch cannot be found' })
            })
        })
    })


})

const getAll = ('/', (req, res) => {
    Branch.getAll(req.user.id, (err, result) => {
        if (err) return res.status(500).json(err)
        // parse extra json: 
        result = parseArrExtra(result)
        res.json(result)
    })
})

const getNested = ('/nested', (req, res) => {
    Branch.getNestedById(req.query.id, (err, result) => {
        if (err) return res.json(err)
        result = parseArrExtra(result)
        return res.json(result)
    })
})

function parseArrExtra(result) {
    result = result.map((b) => {
        b.extra = JSON.parse(b.extra)
        return b
    })
    return result
}

function updateData(data, branch) {
    if (data.name)
        branch.name = data.name
    if (data.type)
        branch.type = data.type
    if (data.parentID)
        branch.parentID = data.parentID
    if (data.lang)
        branch.lang = data.lang
    if (data.pinned)
        branch.pinned = data.pinned
    if (data.positive)
        branch.positive = data.positive
    if (data.extra)
        branch.extra = data.extra
    return branch
}

module.exports = {
    add,
    edit,
    getAll,
    getNested
}
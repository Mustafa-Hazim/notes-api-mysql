const Branch = require('../models/branches')
const Tag = require('../models/tags')
const Group = require('../models/groups')
const Person = require('../models/people')
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
 * 
 * get latest branches getLatest without the root branch
 * get branch by id return next if not id in query
 * get all to get all the branch
 * 
 * getNested: 
 *      to get all nested branches for branch by id
 * 
 * toggleBranchTag:
 *      to toggle branch tag
 * 
 * toggleBranchGroup: 
 *      to toggle branch group
 * 
 * toggleBranchPerson:
 *      to toggle branch person
 * 
 * fullyDeleteBranch
 * 
 * get root branchess: getRootBranches
 *      to get user root branches
 * 
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

// get latest branches: with out root branch
const getLatest = ('/', (req, res, next) => {
    if (!req.query.latest) return next()
    Branch.getLatestBranches(req.user.id, (err, latest) => {
        if (err) return res.status(500).json({ error: err })
        const branches = latest.filter(e => {
            return e.type !== 'root'
        })
        return res.json(branches)
    })
})

// get by id getById.
const getById = ('/', (req, res, next) => {
    if (!req.query.id) return next()
    Branch.getById(req.query.id, (err, result) => {
        if (err) return res.status(500).json({ error: err })
        return res.json(result[0])
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
    if (!req.query.id) return res.status(400).json({ error: 'branch id as id is required' })
    if (req.query.ordered) {
        Branch.getNestedByIdOrdered(req.query.id, (err, result) => {
            if (err) return res.json(err)
            result = parseArrExtra(result)
            return res.json(result)
        })
    } else {
        Branch.getNestedById(req.query.id, (err, result) => {
            if (err) return res.json(err)
            result = parseArrExtra(result)
            return res.json(result)
        })
    }
})


/**
 * this function will insert new record to branches_tags table 
 * and if the record already inserted then will remove the recorde 
 * in short say --> toggle branche tag <--
 */
const toggleBranchTag = ('/toggle-tag', (req, res) => {
    if (!req.body.tagID || !req.body.branchID) return res.status(400).json({ err: 'need branchID and tagID' })
    Tag.branchesTagsInsert(req.body.branchID, req.body.tagID, (err, result) => {
        if (err) {
            if (err.errno === 1062) {
                Tag.removeBranchTag(req.body.branchID, req.body.tagID, (removeTagErr, removeTagRes) => {
                    if (removeTagErr)
                        return res.json(removeTagErr)
                    else {
                        return res.json({ msg: 'tag removed' })
                    }
                })
            } else {
                return res.send(err)
            }
        } else {
            return res.json({ msg: 'tag added' })
        }
    })
})

/**
 * this function will insert new record to branches_groups table 
 * and if the record already inserted then will remove the recorde 
 * in short say --> toggle branche group <--
 */
const toggleBranchGroup = ('/toggle-group', (req, res) => {
    if (!req.body.groupID || !req.body.branchID) return res.status(400).json({ err: 'need branchID and groupID' })
    Group.branchesGroupsInsert(req.body.branchID, req.body.groupID, (err, result) => {
        if (err) {
            if (err.errno === 1062) {
                Group.removeBranchGroup(req.body.branchID, req.body.groupID, (removeGroupErr, removeGroupRes) => {
                    if (removeGroupErr)
                        return res.json(removeGroupErr)
                    else {
                        return res.json({ msg: 'group removed' })
                    }
                })
            } else {
                return res.send(err)
            }
        } else {
            return res.json({ msg: 'group added' })
        }
    })
})

/**
 * this function will insert new record to branches_people table 
 * and if the record already inserted then will remove the recorde 
 * in short say --> toggle branche person <--
 */
const toggleBranchPerson = ('/toggle-person', (req, res) => {
    if (!req.body.personID || !req.body.branchID) return res.status(400).json({ err: 'need branchID and personID' })
    Person.branchesPersonInsert(req.body.branchID, req.body.personID, (err, result) => {
        if (err) {
            if (err.errno === 1062) {
                Person.removeBranchPerson(req.body.branchID, req.body.personID, (removePersonErr, removePersonRes) => {
                    if (removePersonErr)
                        return res.json(removePersonErr)
                    else {
                        return res.json({ msg: 'person removed' })
                    }
                })
            } else {
                return res.send(err)
            }
        } else {
            return res.json({ msg: 'person added' })
        }
    })
})


/**
 * get branch tags groups people provide id of the branch:
 * 
 */
// get branch tags
const getBranchTags = ('/branch-tags', (req, res) => {
    if (!req.query.id) return res.status(400).json({ error: 'branch id is required' })
    Branch.getBranchTags(req.query.id)
        .then((result) => { res.json(result) })
        .catch((err) => { res.status(500).json(err) })
})
// get branch groups
const getBranchGroups = ('/branch-groups', (req, res) => {
    if (!req.query.id) return res.status(400).json({ error: 'branch id is required' })
    Branch.getBranchGroups(req.query.id)
        .then((result) => { res.json(result) })
        .catch((err) => { res.status(500).json(err) })
})
// get branch people
const getBranchPeople = ('/branch-people', (req, res) => {
    if (!req.query.id) return res.status(400).json({ error: 'branch id is required' })
    Branch.getBranchPeople(req.query.id)
        .then((result) => { res.json(result) })
        .catch((err) => { res.status(500).json(err) })
})

// fullyDeleteBranch
const fullyDeleteBranch = ('/', (req, res) => {
    if (!req.query.id) return res.status(400).json({ error: 'branch id is required' })
    Branch.fullDeleteBranch(req.query.id)
        .then((result) => {
            return res.json(result)
        }).catch((err) => {
            res.status(500).json(err)
        })
})

// get root barnches: 
const getRootBranches = ('/root', (req, res) => {
    const userID = req.user.id
    Branch.getRootId(userID, (rootId) => {
        Branch.getNestedById(rootId, (err, result) => {
            if (err) return res.status(500).json(err)
            return res.json(result)
        })
    })
})

// get branch origin : 
const getBranchOrigin = ('/origin', (req, res) => {
    if (!req.query.id) return res.statu(400).json({ error: "branch id is required" })
    Branch.getBranchOrigin(req.query.id, (err, result) => {
        if (err) return res.status(500).json({ error: err })
        res.json(result[0])
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

    if (data.pinned == 1) branch.pinned = data.pinned
    if (data.pinned == '1') branch.pinned = data.pinned
    if (data.pinned == 0) branch.pinned = data.pinned
    if (data.pinned == '0') branch.pinned = data.pinned
    if (data.positive == 1) branch.positive = data.positive
    if (data.positive == '1') branch.positive = data.positive
    if (data.positive == 0) branch.positive = data.positive
    if (data.positive == '0') branch.positive = data.positive

    if (data.extra)
        branch.extra = data.extra
    return branch
}

module.exports = {
    add,
    edit,
    getAll,
    getNested,
    toggleBranchTag,
    toggleBranchGroup,
    toggleBranchPerson,
    getBranchTags,
    getBranchGroups,
    getBranchPeople,
    fullyDeleteBranch,
    getRootBranches,
    getBranchOrigin,
    getById,
    getLatest,
}
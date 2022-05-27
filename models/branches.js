const sql = require('../db/connection')

/**
 * save branch 
 * get all branhces getAll
 * get branch by id getById
 * get all branch child getNestedById
 * get all branch tags getBranchTags
 * get all brancg groups getBrachGroups
 * get all branch people getBranchPeople
 * delete branch: and all the nested branches: fullDeleteBranch 
 * getLatestBranches get latest branches 
 */
module.exports = class Branch {
    constructor(data) {

        this.save = (callback) => {
            sql.query("INSERT INTO branches SET ?", data, function (err, res) {
                if (err) return callback(err)
                return callback(null, { id: res.insertId, ...data })
            });

        }
    }


    static getAll = (userId, callback) => {
        sql.query("SELECT * FROM branches WHERE user=?", [userId], function (err, res, fields) {
            if (err) return callback(err);
            else return callback(null, res)
        });
    }

    static getById = (id, callback) => {
        const query = "SELECT * FROM branches WHERE id = ?"
        sql.query(query, [id], (err, result) => {
            callback(err, result)
        })
    }

    static updateById = (data, callback) => {
        const query = "UPDATE branches SET name = ?, type = ?, lang = ?, position = ?, pinned = ? , positive = ?, extra = ?, parentID = ? WHERE id = ?"
        const arrData = [
            data.name, data.type, data.lang, data.position,
            data.pinned, data.positive, data.extra,
            data.parentID, data.id
        ]
        sql.query(query, arrData, (err, result) => {
            callback(err, result)
        })
    }

    static getMaxPosition = (parent, callback) => {
        const query = 'SELECT `position` FROM `branches` WHERE parentID = ? ORDER BY position DESC LIMIT 1;'
        sql.query(query, [parent], (err, res) => {
            if (res.length > 0) {
                const position = res[0].position
                return callback(position)
            }
            callback(0)
        })
    }

    // to get root branch id for the user 
    static getRootId = (user, callback) => {
        const query = "SELECT id FROM `branches` WHERE type = 'root' AND user = ? "
        sql.query(query, [user], (err, result) => {
            if (result.length > 0) {
                const id = result[0].id
                return callback(id)
            }
            return callback(-1)
        })
    }

    //get all branch child by id: 
    static getNestedById = (id, callback) => {
        const query = 'SELECT * FROM branches WHERE parentID = ?'
        sql.query(query, [id], (err, result) => {
            callback(err, result)
        })
    }
    //get all branch child by id: 
    static getNestedByIdOrdered = (id, callback) => {
        const query = 'SELECT * FROM branches WHERE parentID = ? ORDER BY created_at DESC'
        sql.query(query, [id], (err, result) => {
            callback(err, result)
        })
    }

    // get all branch tags:
    static getBranchTags = (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * from branches_tags  JOIN tags on tagID = tags.id WHERE branchID = ?'
            sql.query(query, [id], (err, result) => {
                if (err) reject(err)
                else resolve(result)
            })
        })
    }
    // get all branch groups:
    static getBranchGroups = (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * from branches_groups  JOIN groups on groupID = groups.id WHERE branchID = ?'
            sql.query(query, [id], (err, result) => {
                if (err) reject(err)
                else resolve(result)
            })
        })
    }
    // get all branch people:
    static getBranchPeople = (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * from branches_people  JOIN people on personID = people.id WHERE branchID = ?'
            sql.query(query, [id], (err, result) => {
                if (err) reject(err)
                else resolve(result)
            })
        })
    }
    // delete branch: and all the nested branches:
    static fullDeleteBranch = (id) => {
        return new Promise((reslove, reject) => {
            // query to delete all child branches
            let query = 'DELETE FROM branches WHERE parentID = ?'
            sql.query(query, [id], (err, childRes) => {
                if (err) return reject(err)
                // delete from tags_branches: 
                query = 'DELETE FROM branches_tags WHERE branchID = ?'
                sql.query(query, [id], (err3, tagsRes) => {
                    if (err3) return reject(err3)
                    // delete from branches_people
                    query = 'DELETE FROM branches_people WHERE branchID = ?'
                    sql.query(query, [id], (err4, peopleRes) => {
                        if (err4) return reject(err4)
                        // delete from branches_groups
                        query = 'DELETE FROM branches_groups WHERE branchID = ?'
                        sql.query(query, [id], (err5, groupsRes) => {
                            if (err5) return reject(err5)
                            // query to delete the branch
                            query = 'DELETE FROM branches WHERE id = ?'
                            sql.query(query, [id], (err2, branchRes) => {
                                if (err2) return reject(err2)
                                reslove({ childRes, tagsRes, peopleRes, groupsRes, branchRes })
                            })
                        })
                    })
                })
            })
        })
    }

    // get branch origin: 
    static getBranchOrigin = (id, callback) => {
        let query = 'SELECT parentID FROM branches WHERE id = ?'
        sql.query(query, [id], (errBranch, branch) => {
            if (errBranch) return callback(errBranch)
            if (branch.length > 0) {
                query = 'SELECT * FROM branches WHERE id = ?'
                sql.query(query, [branch[0].parentID], (err, result) => {
                    callback(err, result)
                })
            }
        })
    }

    // get latest branches:
    static getLatestBranches = (userID, callback) => {
        const query = 'SELECT * FROM `branches` WHERE user = ? ORDER BY created_at DESC LIMIT 25;'
        sql.query(query, [userID], (err, result) => {
            callback(err, result)
        })
    }


}

const sql = require('../db/connection')

/**
 * save group 
 * get all groups getAll
 * get group by id getById
 * add branch group branchesGroupsInsert
 * remove branch group removeBranchGroup
 * get all group branches getGroupBranches
 * delete group: deleteGroup
 */
module.exports = class Group {
    constructor(data) {

        this.save = (callback) => {
            sql.query("INSERT INTO groups SET ?", data, function (err, res) {
                if (err) return callback(err)
                return callback(null, { id: res.insertId, ...data })
            });

        }
    }


    static getAll = (userId, callback) => {
        sql.query("SELECT * FROM groups WHERE user=?", [userId], function (err, res, fields) {
            if (err) return callback(err);
            else return callback(null, res)
        });
    }

    static getById = (id, callback) => {
        const query = "SELECT * FROM groups WHERE id = ? AND user = ? "
        sql.query(query, [id], (err, result) => {
            callback(err, result)
        })
    }

    static updateNameDescById = (id, name, description, callback) => {
        const query = "UPDATE groups SET name = ?, description = ? WHERE id = ?"
        sql.query(query, [name, description, id], (err, result) => {
            callback(err, result)
        })
    }

    // add barnch group:
    static branchesGroupsInsert = (branchID, groupID, callback) => {
        const query = 'INSERT INTO branches_groups (branchID, groupID) VALUES (?, ?)'
        const arrData = [branchID, groupID]
        sql.query(query, arrData, (err, result) => {
            callback(err, result)
        })
    }

    // remove barnch group:
    static removeBranchGroup = (branchID, groupID, callback) => {
        const query = "DELETE FROM branches_groups WHERE `branchID` = ? AND `groupID` = ?"
        const arrData = [branchID, groupID]
        sql.query(query, arrData, (err, result) => {
            return callback(err, result)
        })
    }

    //get all group branches
    static getGroupBranches = (groupID, callback) => {
        const query = 'SELECT * from branches_groups  JOIN branches on branchID = branches.id WHERE groupID = ?'
        sql.query(query, [groupID], (err, result) => {
            callback(err, result)
        })
    }

    // search group by name: 
    static searchGroupByName = (q, callback) => {
        const query = "SELECT * from groups where name like " + "'%" + q + "%'"
        sql.query(query, [q], (err, result) => {
            callback(err, result)
        })
    }

    
    // delete group:
    static deleteGroup = (id, callback) => {
        let query = 'DELETE from branches_groups WHERE groupID = ?'
        sql.query(query, [id], (err1, res1 ) => {
            if(err1) return callback(err1)
            query = 'DELETE from groups WHERE id = ?'
            sql.query(query, [id], (err2, res2) => {
                if(err2) return callback(err2)
                callback(res1, res2)
            })
        })
    }

}
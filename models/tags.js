const res = require('express/lib/response');
const sql = require('../db/connection')

/**
 * save tag 
 * get all tags getAll
 * get tag by id getById
 * add branch tag branchesTagsInsert
 * remove branch tag removeBranchTag
 * get all tag branches getTagBranches
 * search tag by name: searchTagByName
 * deleteTag delete tag:
 */
module.exports = class Tag {
    constructor(data) {

        this.save = (callback) => {
            sql.query("INSERT INTO tags SET ?", data, function (err, res) {
                if (err) return callback(err)
                return callback(null, { id: res.insertId, ...data })
            });

        }
    }


    static getAll = (userId, callback) => {
        sql.query("SELECT * FROM tags WHERE user=?", [userId], function (err, res, fields) {
            if (err) return callback(err);
            else return callback(null, res)
        });
    }

    static getById = (id, callback) => {
        const query = "SELECT * FROM tags WHERE id = ?"
        sql.query(query, [id], (err, result) => {
            callback(err, result)
        })
    }

    static updateNameById = (id, tagName, callback) => {
        const query = "UPDATE tags SET name = ? WHERE id = ?"
        sql.query(query, [tagName, id], (err, result) => {
            callback(err, result)
        })
    }

    // add barnch tag:
    static branchesTagsInsert = (branchId, tagId, callback) => {
        const query = 'INSERT INTO branches_tags (branchID, tagID) VALUES (?, ?)'
        const arrData = [branchId, tagId]
        sql.query(query, arrData, (err, result) => {
            callback(err, result)
        })
    }

    // remove barnch tag:
    static removeBranchTag = (branchID, tagID, callback) => {
        const query = "DELETE FROM branches_tags WHERE `branchID` = ? AND `tagID` = ?"
        const arrData = [branchID, tagID]
        sql.query(query, arrData, (err, result) => {
            return callback(err, result)
        })
    }

    //get all tag branches
    static getTagBranches = (tagID, callback) => {
        const query = 'SELECT * from branches_tags  JOIN branches on branchID = branches.id WHERE tagID = ?'
        sql.query(query, [tagID], (err, result) => {
            callback(err, result)
        })
    }



    // search tag by name: 
    static searchTagByName = (q, callback) => {
        const query = "SELECT * from tags where name like " + "'%" + q + "%'"
        sql.query(query, [q], (err, result) => {
            callback(err, result)
        })
    }



    // delete tag:
    static deleteTag = (id, callback) => {
        let query = 'DELETE from branches_tags WHERE tagID = ?'
        sql.query(query, [id], (err1, res1) => {
            if (err1) return callback(err1)
            query = 'DELETE from tags WHERE id = ?'
            sql.query(query, [id], (err2, res2) => {
                if (err2) return callback(err2)
                callback(res1, res2)
            })
        })
    }

}
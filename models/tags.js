const res = require('express/lib/response');
const sql = require('../db/connection')

/**
 * save tag 
 * get all tags getAll
 * get tag by id getById
 * add branch tag
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

    //todo get all tag branches

}
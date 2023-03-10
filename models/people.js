const sql = require('../db/connection')

/**
 * save person 
 * get all people getAll based on the user
 * get tag by id getById
 * add branch person branchesPersonInsert
 * remove branch person removeBranchPerson
 * get all person branches getPersonBranches
 * search person by name: searchPersonByName
 */
module.exports = class Person {
    constructor(data) {

        this.save = (callback) => {
            sql.query("INSERT INTO people SET ?", data, function (err, res) {
                if (err) return callback(err)
                return callback(null, { id: res.insertId, ...data })
            });

        }
    }


    static getAll = (userId, callback) => {
        sql.query("SELECT * FROM people WHERE user=?", [userId], function (err, res, fields) {
            if (err) return callback(err);
            else return callback(null, res)
        });
    }

    static getById = (id, callback) => {
        const query = "SELECT * FROM people WHERE id = ?"
        sql.query(query, [id], (err, result) => {
            callback(err, result)
        })
    }

    static updateNameById = (id, fname, lname, callback) => {
        const query = "UPDATE people SET fname = ?, lname = ? WHERE id = ?"
        sql.query(query, [fname, lname, id], (err, result) => {
            callback(err, result)
        })
    }

    // add barnch person:
    static branchesPersonInsert = (branchID, personID, callback) => {
        const query = 'INSERT INTO branches_people (branchID, personID) VALUES (?, ?)'
        const arrData = [branchID, personID]
        sql.query(query, arrData, (err, result) => {
            callback(err, result)
        })
    }

    // remove barnch person:
    static removeBranchPerson = (branchID, personID, callback) => {
        const query = "DELETE FROM branches_people WHERE `branchID` = ? AND `personID` = ?"
        const arrData = [branchID, personID]
        sql.query(query, arrData, (err, result) => {
            return callback(err, result)
        })
    }


    //get all person branches
    static getPersonBranches = (personID, callback) => {
        const query = 'SELECT * from branches_people  JOIN branches on branchID = branches.id WHERE personID = ?'
        sql.query(query, [personID], (err, result) => {
            callback(err, result)
        })
    }

    // search person by name: 
    static searchPersonByName = (q, callback) => {
        const query = "SELECT * from people where fname like " + "'%" + q + "%' OR lname like" + "'%" + q + "%'"
        sql.query(query, [q], (err, result) => {
            callback(err, result)
        })
    }

    // delete person:
    static deletePerson = (id, callback) => {
        let query = 'DELETE from branches_people WHERE personID = ?'
        sql.query(query, [id], (err1, res1) => {
            if (err1) return callback(err1)
            query = 'DELETE from people WHERE id = ?'
            sql.query(query, [id], (err2, res2) => {
                if (err2) return callback(err2)
                callback(res1, res2)
            })
        })
    }

}
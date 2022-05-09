const sql = require('../db/connection')

/**
 * save person 
 * get all people getAll based on the user
 * get tag by id getById
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

    //todo get all person branches

}
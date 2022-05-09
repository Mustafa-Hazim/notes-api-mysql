const sql = require('../db/connection')

/**
 * save tag 
 * get all tags getAll
 * get tag by id getById
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

    //todo get all tag branches

}
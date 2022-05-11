const sql = require('../db/connection')

/**
 * save branch 
 * get all branhces getAll
 * get branch by id getById
 * get all branch child getNestedById
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

}
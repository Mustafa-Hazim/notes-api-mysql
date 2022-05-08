const sql = require('../db/connection')

module.exports = class User {
    constructor(userData) {
        this.userData = userData

        this.save = (callback) => {
            console.log(this.userData)
            sql.query("INSERT INTO users SET ?", this.userData, function (err, res) {
                if (err) return callback(err)
                return callback(null, { id: res.insertId, ...this.userData })
            });

        }
    }


    static getAll = (callback) => {
        sql.query("SELECT * FROM users ", function (err, res, fields) {
            if (err) return callback(err);
            else return callback(null, res)
        });
    }

    static findByEmail = (email, callback) => {
        sql.query("SELECT * FROM users WHERE email = ?", [email], function (err, res, fields) {
            if (err) return callback(err);
            else return callback(null, res)
        });
    }

}
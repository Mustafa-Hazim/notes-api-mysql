const sql = require('../db/connection')

module.exports = class User {
    constructor(userData) {
        this.userData = userData

        this.save = (callback) => {
            sql.query("INSERT INTO user_cards SET ?", this.userData, function (err, res) {
                if (err) return callback(err)
                return callback(null, { id: res.insertId, ...userData })
            });

        }
    }

    static findByEmail = (email, callback) => {
        sql.query("SELECT * FROM user_cards WHERE email = ?", [email], function (err, res, fields) {
            if (err) return callback(err);
            else return callback(null, res)
        });
    }

    
    static getByUserID = (userId, callback) => {
        sql.query("SELECT * FROM user_cards WHERE userID = ?", [userId], function (err, res, fields) {
            if (err) return callback(err);
            else return callback(null, res)
        });
    }

    static updateUserIdById = (data, callback) => {
        const query = 'UPDATE user_cards SET userID = ?  WHERE id = ?'
        const arrData = [data.userID, data.id]
        sql.query(query, arrData,  (err, res) => {
            if(err) return callback(err)
            else return callback(null, res)
        })
    }


}
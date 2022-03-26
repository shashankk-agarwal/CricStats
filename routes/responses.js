const { dBPool } = require('../services/db')
module.exports = {
    searchPlayers: (req, res) => {
        dBPool.query('SELECT * FROM Sample', (error, results, fields) => {
            console.log({results})
            res.json(results)
        })
    },
    response1: (req, res) => {
        console.log(req.body)
    }
}
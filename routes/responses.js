const { dBPool } = require('../services/db')
module.exports = {
    searchPlayers: (req, res) => {
        dBPool.query('SELECT * FROM Sample', (error, results, fields) => {
            console.log(req.query)
            console.log({results})
            res.json(results)
        })
    },
    response1: (req, res) => {
        dBPool.query('SELECT * FROM Sample', (error, results, fields) => {
            console.log({results})
            stats = results[0]
            res.render('response1.ejs', {stats, batsman: "Batter", bowler: "Bowler"});
        })
    }
}

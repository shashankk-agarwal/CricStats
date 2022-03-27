const { dBPool } = require('../services/db')
module.exports = {
    searchPlayers: (req, res) => {
        console.log(req.query)
        dBPool.query('SELECT * FROM Sample', (error, results, fields) => {
            console.log({results, fields})
            res.json(results)
        })
    },
    response1: (req, res) => {
        dBPool.query('SELECT * FROM Sample', (error, results, fields) => {
            console.log({results})
            stats = results[0]
            res.render('response1.ejs', {stats, batsman: "Batter", bowler: "Bowler"});
        })
    },
    response2: (req, res) => {
        console.log(req.query)
        dBPool.query('SELECT * FROM Sample', (error, results, fields) => {
            console.log({results})
            res.render('response2.ejs', {players: results, headers: fields.map((field) => field.name)});
        })
    }
}

const { dBPool } = require('../services/db')
module.exports = {
    searchPlayers: (req, res) => {
        console.log(req.query)
        dBPool.query('SELECT * FROM Sample', (error, results, fields) => {
            console.log({results, fields})
            res.json(results)
        })
    },
    searchTeams: (req, res) => {
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
    },
    response3: (req, res) => {
        console.log(req.query)
        dBPool.query('SELECT * FROM Sample', (error, results, fields) => {
            console.log({results})
            res.render('response3.ejs', {teams: results, headers: fields.map((field) => field.name)});
        })
    },
    response4: (req, res) => {
        dBPool.query('SELECT * FROM Sample', (error, results, fields) => {
            console.log({results}, req.body)
            stats = results[0]
            res.render('response4.ejs', {stats, player1: "Player1", player2: "Player2"});
        })
    }
}

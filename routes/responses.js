const { dBPool } = require('../services/db')
module.exports = {
    searchPlayers: (req, res) => {
        // console.log(req.query)
        dBPool.query('SELECT * FROM balls LIMIT 10', (error, results, fields) => {
            // console.log({results, fields})
            res.json(results)
        })
    },
    searchTeams: (req, res) => {
        console.log(req.query)
        dBPool.query('SELECT * FROM Sample', (error, results, fields) => {
            console.log({results, fields})
            results = [{team_id: 1, team_name: "RR"}, {team_id: 2, team_name: "KKR"}]
            res.json(results)
        })
    },
    response1: (req, res) => {
        dBPool.query('SELECT * FROM balls LIMIT 10', (error, results, fields) => {
            // console.log({results}, req.body)
            results = [{Season: 2011, Batter: "Kohli", Bowler: "Bumrah", Wickets: 3, Runs: 220}, {Season: 2023, Batter: "Kohli", Bowler: "Bumrah", Wickets: 2, Runs: 520}]
            const stats = results.map((result) => {
                const { Batter, Bowler, ...stat } = result
                return stat
            })
            console.log({stats})
            res.render('response_compare.ejs', {stats, p1: results[0]['Batter'] + " (Batter)", p2: results[0]['Bowler'] + " (Bowler)"});
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
            results = [{Season: 2011, Player1: "Kohli", Player2: "Bumrah", Wickets: 3, Runs: 220}, {Season: 2023, Player1: "Kohli", Player2: "Bumrah", Wickets: 2, Runs: 520}]
            const stats = results.map((result) => {
                const { Player1, Player2, ...stat } = result
                return stat
            })
            console.log({stats})
            res.render('response_compare.ejs', {stats, p1: results[0]['Player1'], p2: results[0]['Player2']});
        })
    },
    response5: (req, res) => {
        dBPool.query('SELECT * FROM Sample', (error, results, fields) => {
            console.log({results}, req.body)
            results = [{Team: "RCB", Season: 2011, "Matches Played": 23, "Matches Won": 12}, {Team: "RCB", Season: 2015, "Matches Played": 15, "Matches Won": 13}]
            const stats = results.map((result) => {
                const { Team, ...stat } = result
                return stat
            })
            console.log({stats})
            res.render('response_stats.ejs', {stats, name: results[0]['Team']});
        })
    },
    response6: (req, res) => {
        console.log(req.query)
        dBPool.query('SELECT * FROM Sample', (error, results, fields) => {
            console.log({results})
            results = [{Season: 2011, Opponent: "RR", Team: "RCB", IsWin: "Yes"}, {Season: 2011, Opponent: "MI", Team: "RCB", IsWin: "No"}, {Season: 2022, Opponent: "KXIP", Team: "RCB", IsWin: "Yes"}]
            fields = [{name: "Season"}, {name: "Opponent"}, {name: "Team"}, {name: "IsWin"}]
            const stats = results.map((result) => {
                const { Team, ...stat } = result
                return stat
            })
            res.render('response_table.ejs', {name: results[0]['Team'], stats, headers: fields.map((field) => field.name).filter(name => name != "Team")});
        })
    },
    response7: (req, res) => {
        dBPool.query('SELECT * FROM Sample', (error, results, fields) => {
            console.log({results}, req.body)
            results = [{Player: "Kohli", Season: 2011, "Runs": 451, "Dismissals": 12}, {Player: "Kohli", Season: 2014, "Runs": 987, "Dismissals": 7}]
            const stats = results.map((result) => {
                const { Player, ...stat } = result
                return stat
            })
            console.log({stats})
            res.render('response_stats.ejs', {stats, name: results[0]['Player']});
        })
    },
    response8: (req, res) => {
        dBPool.query('SELECT * FROM Sample', (error, results, fields) => {
            console.log({results})
            results = [{Season: 2011, Runs: 55, Team: "RCB", MOTM: "Yes", "Player": "Kohli"}, {Season: 2011, Runs: 21, Team: "RCB", MOTM: "No", "Player": "Kohli"}, {Season: 2013, Runs: 34, Team: "KKR", MOTM: "No", "Player": "Kohli"}]
            fields = [{name: "Season"}, {name: "Runs"}, {name: "Team"}, {name: "MOTM"}, {name: "Player"}]
            const stats = results.map((result) => {
                const { Player, ...stat } = result
                return stat
            })
            res.render('response_table.ejs', {name: results[0]['Player'], stats, headers: fields.map((field) => field.name).filter(name => name != "Player")});
        })
    },
    response9: (req, res) => {
        dBPool.query('SELECT * FROM Sample', (error, results, fields) => {
            console.log({results}, req.body)
            results = [{Player: "Bumrah", Season: 2011, "Wickets": 24, "Runs Conceded": 450}, {Player: "Bumrah", Season: 2014, "Runs Conceded": 311, "Wickets": 21}]
            const stats = results.map((result) => {
                const { Player, ...stat } = result
                return stat
            })
            console.log({stats})
            res.render('response_stats.ejs', {stats, name: results[0]['Player']});
        })
    },
    response10: (req, res) => {
        dBPool.query('SELECT * FROM Sample', (error, results, fields) => {
            console.log({results})
            results = [{Season: 2011, Wickets: 3, Team: "RCB", MOTM: "Yes", "Player": "Bumrah"}, {Season: 2011, Wickets: 0, Team: "RCB", MOTM: "No", "Player": "Bumrah"}, {Season: 2013, Wickets: 4, Team: "KKR", MOTM: "No", "Player": "Bumrah"}]
            fields = [{name: "Season"}, {name: "Wickets"}, {name: "Team"}, {name: "MOTM"}, {name: "Player"}]
            const stats = results.map((result) => {
                const { Player, ...stat } = result
                return stat
            })
            res.render('response_table.ejs', {name: results[0]['Player'], stats, headers: fields.map((field) => field.name).filter(name => name != "Player")});
        })
    },
}

const { dBPool } = require('../services/db')
module.exports = {
    query1: (req, res) => {
        console.log("Q1")
        res.render('query_compare.ejs', {p1: "Batter", p2: "Bowler", n: 1, home: 2})
    },
    query2: (req, res) => {
        console.log("Q2")
        dBPool.query(`SELECT player_name as Batter, SUM(runs_scored) as RunsScored FROM balls inner join players on balls.striker = players.player_id GROUP BY striker ORDER BY RunsScored DESC LIMIT 10;`, (error, results, fields) => {
            if(error) {
                res.render("msg.ejs", {msg: error, home: 1})
                return
            }
            if(results.length === 0) {
                res.render("msg.ejs", {msg: "No relevant results", home: 1})
                return
            }
            const stats = results
            res.render('response_top10.ejs', {img: 'batter', home: 1, name: "Top 10 Run Scorers", stats, headers: fields.map((field) => field.name)});
        })
    },
    query20: (req, res) => {
        console.log("Q20")
        dBPool.query(`SELECT player_name as Batter, SUM(runs_scored) as RunsScored, SUM(runs_scored)*100/COUNT(bowler_extras) as StrikeRate FROM (SELECT player_name, runs_scored, bowler_extras FROM balls inner join players on balls.striker = players.player_id WHERE bowler_extras = 0) as T1 GROUP BY player_name HAVING COUNT(bowler_extras) >= 500 ORDER BY StrikeRate DESC LIMIT 10;`, (error, results, fields) => {
            if(error) {
                res.render("msg.ejs", {msg: error, home: 1})
                return
            }
            if(results.length === 0) {
                res.render("msg.ejs", {msg: "No relevant results", home: 1})
                return
            }
            const stats = results
            res.render('response_top10.ejs', {img: 'batter', home: 1, name: "Top 10 Big Strikers (Min 500 Balls)", stats, headers: fields.map((field) => field.name)});
        })
    },
    query3: (req, res) => {
        console.log("Q3")
        dBPool.query(`SELECT player_name as Bowler, SUM(bowler_wicket) as WicketsTaken FROM (SELECT player_name, bowler_wicket FROM balls inner join players on balls.bowler = players.player_id) as T1 GROUP BY player_name ORDER BY WicketsTaken DESC LIMIT 10;`, (error, results, fields) => {
            if(error) {
                res.render("msg.ejs", {msg: error, home: 1})
                return
            }
            if(results.length === 0) {
                res.render("msg.ejs", {msg: "No relevant results", home: 1})
                return
            }
            const stats = results
            res.render('response_top10.ejs', {img: 'bowler', home: 1, name: "Top 10 Wicket Takers", stats, headers: fields.map((field) => field.name)});
        })
    },
    query30: (req, res) => {
        console.log("Q30")
        dBPool.query(`SELECT player_name as Bowler, BallsBowled, (RunsGiven*6)/BallsBowled as Economy FROM 
        (SELECT bowler, player_name, SUM(runs_scored) + SUM(bowler_extras) as RunsGiven FROM (SELECT bowler, player_name, runs_scored, bowler_extras FROM balls inner join players on balls.bowler = players.player_id) as T1 GROUP BY bowler) as F1 INNER JOIN 
        (SELECT bowler, COUNT(*) as BallsBowled FROM (SELECT bowler, ball_id FROM balls WHERE bowler_extras = 0) as T1 GROUP BY bowler HAVING BallsBowled >= 500) AS F2 ON F1.bowler = F2.bowler ORDER BY Economy LIMIT 10;`, (error, results, fields) => {
            if(error) {
                res.render("msg.ejs", {msg: error, home: 1})
                return
            }
            if(results.length === 0) {
                res.render("msg.ejs", {msg: "No relevant results", home: 1})
                return
            }
            const stats = results
            res.render('response_top10.ejs', {img: 'bowler', home: 1, name: "Top 10 Economical Bowlers (Min 500 Balls)", stats, headers: fields.map((field) => field.name)});
        })
    },
    query4: (req, res) => {
        console.log("Q4")
        res.render('query_compare.ejs', {p1: "Player-1", p2: "Player-2", n: 4, home: 2})
    },
    query40: (req, res) => {
        console.log("Q40")
        res.render('query_compare.ejs', {p1: "Player-1", p2: "Player-2", n: 40, home: 2})
    },
    query5: (req, res) => {
        console.log("Q5")
        res.render('query_team.ejs', {n: 5, home: 4})
    },
    query6: (req, res) => {
        console.log("Q6")
        res.render('query_team.ejs', {n: 6, home: 4})
    },
    query7: (req, res) => {
        console.log("Q7")
        res.render('query_player.ejs', {n: 7, type: 'Batter', home: 3})
    },
    query8: (req, res) => {
        console.log("Q8")
        res.render('query_player.ejs', {n: 8, type: 'Batter', home: 3})
    },
    query9: (req, res) => {
        console.log("Q9")
        res.render('query_player.ejs', {n: 9, type: 'Bowler', home: 3})
    },
    query10: (req, res) => {
        console.log("Q10")
        res.render('query_player.ejs', {n: 10, type: 'Bowler', home: 3})
    },
    query11: (req, res) => {
        console.log("Q7")
        res.render('query_player.ejs', {n: 11, type: 'Fielder', home: 3})
    }
}

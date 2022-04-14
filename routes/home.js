const { dBPool } = require('../services/db')
module.exports = {
    getHomePage: (req, res) => {
        buttons = [{name: "Bowlers by Wickets", id: 2}, {name: "Bowlers by Wickets", id: 3}, {name: "Batter vs Bowler", id: 1}, {name: "Compare Batting Stats", id: 4}, {name: "Compare Bowling Stats", id: 40}, {name: "Batting Stats by Season", id: 5}, {name: "Batting Stats by Match", id: 6}, {name: "Bowling Stats by Season", id: 7}, {name: "Bowling Stats by Match", id: 8}, {name: "Batting Stats by Season", id: 9}, {name: "Batting Stats by Match", id: 10}]
        res.render('homepage.ejs', {home: 0, buttons})
    },
    getHomeTab: (req, res) => {
        let tab = req.params.tab
        if(tab == 1) {
            buttons = [{name: "Run Scorers", id: 2}, {name: "Big Strikers", id: 20}, {name: "Wicket Takers", id: 3}, {name: "Economical Bowlers", id: 30}]
            res.render('home.ejs', {home: 1, buttons})
        }
        if(tab == 2) {
            buttons = [{name: "Batter vs Bowler", id: 1}, {name: "Compare Batting Stats", id: 4}, {name: "Compare Bowling Stats", id: 40}]
            res.render('home.ejs', {home: 2, buttons})
        }
        if(tab == 3) {
            buttons = [{name: "Batting Stats by Season", id: 7}, {name: "Batting Stats by Match", id: 8}, {name: "Bowling Stats by Season", id: 9}, {name: "Bowling Stats by Match", id: 10}, {name: "Fielding Stats by Season", id: 11}]
            res.render('home.ejs', {home: 3, buttons})
        }
        if(tab == 4) {
            buttons = [{name: "Team Stats by Season", id: 5}, {name: "Team Stats by Match", id: 6}]
            res.render('home.ejs', {home: 4, buttons})
        }
        if(tab == 5) {
            dBPool.query(`SELECT P1.season as Season, P3.champion as Winner, P3.runnerup as RunnerUp, P1.player_name AS OrangeCap, P1.RunsScored AS Runs, P2.player_name AS PurpleCap, P2.WicketsTaken AS Wickets FROM
            (SELECT * FROM 
            (SELECT season, striker as batsman, player_name, SUM(runs_scored) AS RunsScored FROM (SELECT T2.season, T1.striker, T3.player_name, T1.runs_scored FROM balls as T1 INNER JOIN matches as T2 inner join players as T3 ON T1.match_id = T2.match_id and T1.striker = T3.player_id) AS T3 GROUP BY season, batsman) AS F1 
            WHERE (season, RunsScored) IN (SELECT season, MAX(RunsScored) FROM (SELECT season, striker, SUM(runs_scored) AS RunsScored FROM (SELECT T2.season, T1.striker, T1.runs_scored FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id) AS T3 GROUP BY season, striker) AS F1 GROUP BY season)) AS P1 INNER JOIN 
            (SELECT * FROM 
            (SELECT season, bowler, player_name, SUM(bowler_wicket) AS WicketsTaken FROM (SELECT T2.season, T1.bowler, T3.player_name, T1.bowler_wicket FROM balls as T1 INNER JOIN matches as T2 inner join players as T3 ON T1.match_id = T2.match_id AND T1.bowler = T3.player_id) AS T3 GROUP BY season, bowler) AS F1 
            WHERE (season, WicketsTaken) IN (SELECT season, MAX(WicketsTaken) FROM (SELECT season, bowler, SUM(bowler_wicket) AS WicketsTaken FROM (SELECT T2.season, T1.bowler, T1.bowler_wicket FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id) AS T3 GROUP BY season, bowler) AS F1 GROUP BY season)) AS P2 INNER JOIN 
            (SELECT T1.season, match_winner AS champion, CASE WHEN team_name_1 = match_winner THEN team_name_2 ELSE team_name_1 END AS runnerup FROM (SELECT season, MAX(match_id) AS final_id FROM matches GROUP BY season) AS T1 INNER JOIN matches ON matches.season = T1.season AND matches.match_id = T1.final_id) AS P3 ON P1.season = P2.season AND P2.season = P3.season ORDER BY season;`, (error, results, fields) => {
                if(error) {
                    res.send(error)
                    return
                }
                if(results.length === 0) {
                    res.send("No relevant results")
                    return
                }
                const stats = results
                res.render('response_summary.ejs', {img: 'ipl', home: 5, stats});
            })
        }
    }
}

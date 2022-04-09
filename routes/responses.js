const { dBPool } = require('../services/db')
module.exports = {
    searchPlayers: (req, res) => {
        dBPool.query("SELECT player_id, player_name FROM players WHERE player_name LIKE '%" + req.query.queryString + "%';", (error, results, fields) => {
            res.json(results)
        })
    },
    searchTeams: (req, res) => {
        dBPool.query('SELECT * FROM teams', (error, results, fields) => {
            res.json(results)
        })
    },
    response1: (req, res) => {
        let { "Batter-res": bat, "Bowler-res": ball } = req.body;
        if(bat === undefined || ball === undefined) {
            res.send("No player chosen")
            return
        }
        dBPool.query('SELECT season as Season, striker as Batter, striker_attr as BatterAttr, any_value(batsman_team) as BatterTeam, bowler as Bowler, bowler_attr as BowlerAttr, any_value(bowler_team) as BowlerTeam, SUM(runs_scored) AS RunsScored, SUM(IsNotExtraBall) AS BallsFaced, SUM(BowlerWicket) AS Dismissals,  SUM(runs_scored)*100/SUM(IsNotExtraBall) AS StrikeRate FROM  (SELECT T2.season, T5.player_name as striker, T5.batting_hand as striker_attr, T3.team_name AS batsman_team, T6.player_name as bowler, T6.bowling_skill as bowler_attr, T4.team_name AS bowler_team, runs_scored, bowler_extras = 0 AS IsNotExtraBall, bowler_wicket AS BowlerWicket FROM balls as T1 INNER JOIN matches as T2 inner join teams as T3 inner join teams as T4 inner join players as T5 inner join players as T6 ON T1.match_id = T2.match_id and T3.team_id = T1.team_batting and T4.team_id = T1.team_bowling and T5.player_id = T1.striker and T6.player_id = T1.bowler AND T1.bowler = ' + String(ball) + ' AND T1.striker = ' + String(bat) + ') AS F3 GROUP BY season ORDER BY season;', (error, results, fields) => {
            if(error) {
                res.send(error)
                return
            }
            if(results.length === 0) {
                res.send("No relevant results")
                return
            }
            const stats = results.map((result) => {
                const { Batter, Bowler, BatterAttr, BowlerAttr, ...stat } = result
                return stat
            })
            res.render('response_compare.ejs', {home: 2, headers: fields.map((field) => String(field.name)).filter(name => name !== 'Batter' && name !== 'Bowler' && name !== 'BatterAttr' && name !== 'BowlerAttr'), stats, p1: results[0]['Batter'] + " (" + results[0]['BatterAttr'] + ")", p2: results[0]['Bowler'] + " (" + results[0]['BowlerAttr'] + ")"});
        })
    },
    // response2: (req, res) => {
    //     console.log(req.query)
    //     dBPool.query('SELECT * FROM Sample', (error, results, fields) => {
    //         console.log({results})
    //         res.render('response2.ejs', {players: results, headers: fields.map((field) => field.name)});
    //     })
    // },
    // response3: (req, res) => {
    //     console.log(req.query)
    //     dBPool.query('SELECT * FROM Sample', (error, results, fields) => {
    //         console.log({results})
    //         res.render('response3.ejs', {teams: results, headers: fields.map((field) => field.name)});
    //     })
    // },
    response4: (req, res) => {
        let { "Player-1-res": p1, "Player-2-res": p2 } = req.body;
        if(p1 === undefined || p2 === undefined) {
            res.send("No player chosen")
            return
        }
        dBPool.query(`SELECT FT1.season as Season1, FT1.batsman as Batsman1, FT1.team as Team1, FT1.RunsScored as RunsScored1, FT1.BallsFaced as BallsFaced1, FT1.Dismissals as Dismissals1, FT1.StrikeRate as StrikeRate1, FT1.Average as Average1, FT2.batsman as Batsman2, FT2.team as Team2, FT2.RunsScored as RunsScored2, FT2.BallsFaced as BallsFaced2, FT2.dismissals as Dismissals2, FT2.StrikeRate as StrikeRate2, FT2.Average as Average2 FROM 
        (SELECT batsman, F1.season, team, Innings, RunsScored, BallsFaced, Dismissals, (RunsScored*100)/BallsFaced as StrikeRate, (RunsScored)/dismissals as Average FROM (SELECT batsman, season, any_value(team_name) as team, SUM(runs_scored) as RunsScored FROM (SELECT T2.season, T4.player_name as batsman, (T3.team_name) as team_name, T1.runs_scored FROM balls as T1 INNER JOIN matches as T2 inner join teams as T3 inner join players as T4 ON T4.player_id = T1.striker and T1.team_batting = T3.team_id and T1.match_id = T2.match_id AND T1.striker = ` + String(p1) + `) as T3 GROUP BY season) AS F1 INNER JOIN 
        (SELECT season, COUNT(player_out) as Dismissals FROM (SELECT T2.season, T1.player_out FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.player_out = ` + String(p1) + `) as T3 GROUP BY season) AS F2 INNER JOIN 
        (SELECT season, COUNT(bowler_extras) as BallsFaced FROM (SELECT T2.season, T1.bowler_extras FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.striker = ` + String(p1) + ` AND T1.bowler_extras = 0) as T3 GROUP BY season) AS F3 INNER JOIN 
        (SELECT season, COUNT(match_id) as Innings FROM (SELECT DISTINCT T2.season, T1.match_id FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.striker = ` + String(p1) + `) as T3 GROUP BY season) AS F4 ON F1.season = F2.season AND F2.season = F3.season AND F3.season = F4.season ORDER BY season) AS FT1 INNER JOIN 
        (SELECT batsman, F1.season, team, Innings, RunsScored, BallsFaced, Dismissals, (RunsScored*100)/BallsFaced as StrikeRate, (RunsScored)/dismissals as Average FROM (SELECT batsman, season, any_value(team_name) as team, SUM(runs_scored) as RunsScored FROM (SELECT T2.season, T4.player_name as batsman, (T3.team_name) as team_name, T1.runs_scored FROM balls as T1 INNER JOIN matches as T2 inner join teams as T3 inner join players as T4 ON T4.player_id = T1.striker and T1.team_batting = T3.team_id and T1.match_id = T2.match_id AND T1.striker = ` + String(p2) + `) as T3 GROUP BY season) AS F1 INNER JOIN 
        (SELECT season, COUNT(player_out) as Dismissals FROM (SELECT T2.season, T1.player_out FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.player_out = ` + String(p2) + `) as T3 GROUP BY season) AS F2 INNER JOIN 
        (SELECT season, COUNT(bowler_extras) as BallsFaced FROM (SELECT T2.season, T1.bowler_extras FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.striker = ` + String(p2) + ` AND T1.bowler_extras = 0) as T3 GROUP BY season) AS F3 INNER JOIN 
        (SELECT season, COUNT(match_id) as Innings FROM (SELECT DISTINCT T2.season, T1.match_id FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.striker = ` + String(p2) + `) as T3 GROUP BY season) AS F4 ON F1.season = F2.season AND F2.season = F3.season AND F3.season = F4.season ORDER BY season) AS FT2 ON FT1.season = FT2.season;`, (error, results_bat, fields_bat) => {
            if(error) {
                res.send(error)
                return
            }
            if(results_bat.length === 0) {
                res.send("No relevant results")
                return
            }
            const stats_bat = results_bat.map((result) => {
                const { Batsman1, Batsman2, ...stat } = result
                return stat
            })
            res.render('response_compare_alt.ejs', {img: 'batter', home: 2, headers: fields_bat.map((field) => String(field.name).substring(0, String(field.name).length - 1)).filter(name => name != "Batsman").filter((item, i, ar) => { return ar.indexOf(item) === i; }), stats: stats_bat, p1: results_bat[0]['Batsman1'], p2: results_bat[0]['Batsman2'], type: 'Batting'});
        })
    },
    response40: (req, res) => {
        let { "Player-1-res": p1, "Player-2-res": p2 } = req.body;
        if(p1 === undefined || p2 === undefined) {
            res.send("No player chosen")
            return
        }
        dBPool.query(`SELECT FT1.season as Season1, FT1.bowler as Bowler1, FT1.team as Team1, FT1.Innings as Innings1, FT1.WicketsTaken as WicketsTaken1, FT1.RunsGiven as RunsConceded1, FT1.BallsBowled as BallsBowled1, FT1.StrikeRate as StrikeRate1, FT1.Average as Average1, FT1.Economy as Economy1, FT2.bowler as Bowler2, FT2.team as Team2, FT2.Innings as Innings2, FT2.WicketsTaken as WicketsTaken2, FT2.RunsGiven as RunsConceded2, FT2.BallsBowled as BallsBowled2, FT2.StrikeRate as StrikeRate2, FT2.Average as Average2, FT2.Economy as Economy2 FROM 
        (SELECT bowler, F1.season, team, Innings, WicketsTaken, RunsGiven, BallsBowled, BallsBowled/WicketsTaken as StrikeRate, RunsGiven/WicketsTaken as Average, (RunsGiven*6)/BallsBowled as Economy FROM (SELECT any_value(bowler) as bowler, season, any_value(team_name) as team, SUM(runs_scored) + SUM(bowler_extras) as RunsGiven FROM (SELECT T2.season, T4.player_name as bowler, T3.team_name, T1.runs_scored, T1.bowler_extras FROM balls as T1 INNER JOIN matches as T2 inner join teams as T3 inner join players as T4 ON T4.player_id = T1.bowler and T1.team_bowling = T3.team_id and T1.match_id = T2.match_id AND T1.bowler = ` + String(p1) + `) as T3 GROUP BY season) as F1 INNER JOIN 
        (SELECT season, SUM(bowler_wicket) as WicketsTaken FROM (SELECT T2.season, T1.bowler_wicket FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.bowler = ` + String(p1) + `) as T3 GROUP BY season) AS F2 INNER JOIN
        (SELECT season, COUNT(ball_id) as BallsBowled FROM (SELECT T2.season, T1.ball_id FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.bowler = ` + String(p1) + ` AND T1.bowler_extras = 0) as T3 GROUP BY season) AS F3 INNER JOIN
        (SELECT season, COUNT(match_id) as Innings FROM (SELECT DISTINCT T2.season, T1.match_id FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.bowler = ` + String(p1) + `) as T3 GROUP BY season) AS F4 ON F1.season = F2.season AND F2.season = F3.season AND F3.season = F4.season ORDER BY season) AS FT1 INNER JOIN 
        (SELECT bowler, F1.season, team, Innings, WicketsTaken, RunsGiven, BallsBowled, BallsBowled/WicketsTaken as StrikeRate, RunsGiven/WicketsTaken as Average, (RunsGiven*6)/BallsBowled as Economy FROM (SELECT any_value(bowler) as bowler, season, any_value(team_name) as team, SUM(runs_scored) + SUM(bowler_extras) as RunsGiven FROM (SELECT T2.season, T4.player_name as bowler, T3.team_name, T1.runs_scored, T1.bowler_extras FROM balls as T1 INNER JOIN matches as T2 inner join teams as T3 inner join players as T4 ON T4.player_id = T1.bowler and T1.team_bowling = T3.team_id and T1.match_id = T2.match_id AND T1.bowler = ` + String(p2) + `) as T3 GROUP BY season) as F1 INNER JOIN 
        (SELECT season, SUM(bowler_wicket) as WicketsTaken FROM (SELECT T2.season, T1.bowler_wicket FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.bowler = ` + String(p2) + `) as T3 GROUP BY season) AS F2 INNER JOIN
        (SELECT season, COUNT(ball_id) as BallsBowled FROM (SELECT T2.season, T1.ball_id FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.bowler = ` + String(p2) + ` AND T1.bowler_extras = 0) as T3 GROUP BY season) AS F3 INNER JOIN
        (SELECT season, COUNT(match_id) as Innings FROM (SELECT DISTINCT T2.season, T1.match_id FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.bowler = ` + String(p2) + `) as T3 GROUP BY season) AS F4 ON F1.season = F2.season AND F2.season = F3.season AND F3.season = F4.season ORDER BY season) AS FT2 ON FT1.season = FT2.season;`, (error, results_ball, fields_ball) => {
            if(error) {
                res.send(error)
                return
            }
            if(results_ball.length === 0) {
                res.send("No relevant results")
                return
            }
            const stats_ball = results_ball.map((result) => {
                const { Bowler1, Bowler2, ...stat } = result
                return stat
            })
            res.render('response_compare_alt.ejs', {img: 'bowler', home: 2, headers: fields_ball.map((field) => String(field.name).substring(0, String(field.name).length - 1)).filter(name => name != "Bowler").filter((item, i, ar) => { return ar.indexOf(item) === i; }), stats: stats_ball, p1: results_ball[0]['Bowler1'], p2: results_ball[0]['Bowler2'], type: 'Bowling'});
        })
    },
    response5: (req, res) => {
        let { teamid: team } = req.query
        if(team === undefined) {
            res.send("No team chosen")
            return
        }
        dBPool.query(`SELECT team, F1.season AS Season, MatchesPlayed, MatchesWon as Won, MatchesLost as Lost, RunsScored, WicketsTaken, HighestTotalScore, max_win_runs AS BestWinByRuns, max_win_wick AS BestWinByWickets, max_loss_runs AS WorstLossByRuns, max_loss_wick AS WorstLossByWickets FROM (SELECT T3.team_name AS team, T2.season, SUM(runs_scored) + SUM(extra_runs) AS RunsScored FROM balls as T1 INNER JOIN matches as T2 inner join teams as T3 ON T1.match_id = T2.match_id and T3.team_id = T1.team_batting AND T1.team_batting = ` + String(team) + ` GROUP BY season) AS F1 INNER JOIN 
        (SELECT T2.season, COUNT(player_out) AS WicketsTaken FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.team_bowling = ` + String(team) + ` GROUP BY season) AS F2 INNER JOIN 
        (SELECT season, COUNT(match_id) AS MatchesPlayed, SUM(IsWon) as MatchesWon, SUM(IsLost) as MatchesLost FROM (SELECT DISTINCT T2.season, T1.match_id, T2.match_winner = T3.team_name as IsWon, (T2.match_winner != T3.team_name AND T2.match_winner != "tied" AND T2.match_winner != "abandoned" AND T2.match_winner IS NOT NULL) AS IsLost FROM balls as T1 INNER JOIN matches as T2 inner join teams as T3 ON T1.match_id = T2.match_id AND T1.team_batting = ` + String(team) + ` and T3.team_id = T1.team_batting) AS T3 GROUP BY season) AS F3 INNER JOIN 
        (SELECT season, MAX(RunsScored) AS HighestTotalScore FROM (SELECT T2.season, T1.match_id, SUM(runs_scored) + SUM(extra_runs) AS RunsScored FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.team_batting = ` + String(team) + ` GROUP BY season, match_id) AS T3 GROUP BY season) AS F4 INNER JOIN 
        (SELECT season, max(win_margin) as max_win_runs FROM matches as T1 inner join teams as T2 on T2.team_name = T1.match_winner and T2.team_id = ` + String(team) + ` where win_type like '%run%' group by season) AS F5 INNER JOIN 
        (SELECT season, max(win_margin) as max_win_wick FROM matches as T1 inner join teams as T2 on T2.team_name = T1.match_winner and T2.team_id = ` + String(team) + ` where win_type like '%wick%' group by season) AS F6 INNER JOIN 
        (SELECT season, max(win_margin) as max_loss_runs FROM matches as T1 inner join teams as T2 on T2.team_name != T1.match_winner and T2.team_name in (T1.team_name_1, team_name_2) and T2.team_id = ` + String(team) + ` where win_type like '%run%' group by season) AS F7 INNER JOIN 
        (SELECT season, max(win_margin) as max_loss_wick FROM matches as T1 inner join teams as T2 on T2.team_name != T1.match_winner and T2.team_name in (T1.team_name_1, team_name_2) and T2.team_id = ` + String(team) + ` where win_type like '%wick%' group by season) AS F8 
        ON F1.season = F2.season AND F2.season = F3.season AND F3.season = F4.season AND F4.season = F5.season AND F5.season = F6.season AND F6.season = F7.season AND F7.season = F8.season;`, (error, results, fields) => {
            if(error) {
                res.send(error)
                return
            }
            if(results.length === 0) {
                res.send("No relevant results")
                return
            }
            const stats = results.map((result) => {
                const { team, ...stat } = result
                return stat
            })
            res.render('response_stats.ejs', {img: String(team), home: 4, stats, name: results[0]['team']});
        })
    },
    response6: (req, res) => {
        let { teamid: team } = req.query
        if(team === undefined) {
            res.send("No team chosen")
            return
        }
        dBPool.query('SELECT season as Season, F1.match_id as Match_ID, team, opposition_team as Opponent, RunsScored, WicketsUsed, RunsConceded, WicketsTaken, Winner = team AS IsWon, Toss = team AS TossWon FROM (SELECT T2.season, T1.match_id, T3.team_name AS team, T4.team_name AS opposition_team, SUM(runs_scored) + SUM(extra_runs) AS RunsScored, COUNT(player_out) AS WicketsUsed, T2.match_winner as Winner, T2.toss_winner as Toss FROM balls as T1 INNER JOIN matches as T2 inner join teams as T3 inner join teams as T4 ON T1.match_id = T2.match_id and T3.team_id = T1.team_batting and T4.team_id = T1.team_bowling AND T1.team_batting = ' + String(team) + ' GROUP BY match_id, team, opposition_team) AS F1 INNER JOIN (SELECT T1.match_id, SUM(runs_scored) + SUM(extra_runs) AS RunsConceded, COUNT(player_out) AS WicketsTaken FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.team_bowling = ' + String(team) + ' GROUP BY match_id) AS F2 ON F1.match_id = F2.match_id ORDER BY match_id;', (error, results, fields) => {
            if(error) {
                res.send(error)
                return
            }
            if(results.length === 0) {
                res.send("No relevant results")
                return
            }
            const stats = results.map((result) => {
                const { team, ...stat } = result
                return stat
            })
            res.render('response_table.ejs', {img: String(team), home: 4, name: results[0]['team'], stats, headers: fields.map((field) => field.name).filter(name => name != "team")});
        })
    },
    response7: (req, res) => {
        let { "Batter-res": p1 } = req.body;
        if(p1 === undefined) {
            res.send("No player chosen")
            return
        }
        dBPool.query(`SELECT batsman as Batsman, F1.season as Season, team as Team, Innings, RunsScored, BallsFaced, dismissals as Dismissals, (RunsScored*100)/BallsFaced as StrikeRate, (RunsScored)/dismissals as Average FROM 
        (SELECT batsman, season, any_value(team_name) as team, SUM(runs_scored) as RunsScored FROM (SELECT T2.season, T4.player_name as batsman, T3.team_name, T1.runs_scored FROM balls as T1 INNER JOIN matches as T2 inner join teams as T3 inner join players as T4 ON T3.team_id = T1.team_batting and T1.match_id = T2.match_id AND T1.striker = ` + String(p1) + ` and T1.striker = T4.player_id) as T3 GROUP BY season) AS F1 INNER JOIN 
        (SELECT season, COUNT(*) as dismissals FROM (SELECT T2.season, T1.player_out FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.player_out = ` + String(p1) + `) as T3 GROUP BY season) AS F2 INNER JOIN 
        (SELECT season, COUNT(*) as BallsFaced FROM (SELECT T2.season, T1.bowler_extras FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.striker = ` + String(p1) + ` AND T1.bowler_extras = 0) as T3 GROUP BY season) AS F3 INNER JOIN 
        (SELECT season, COUNT(match_id) as Innings FROM (SELECT DISTINCT T2.season, T1.match_id FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.striker = ` + String(p1) + `) as T3 GROUP BY season) AS F4 ON F1.season = F2.season AND F2.season = F3.season AND F3.season = F4.season ORDER BY season;`, (error, results, fields) => {
            if(error) {
                res.send(error)
                return
            }
            if(results.length === 0) {
                res.send("No relevant results")
                return
            }
            const stats = results.map((result) => {
                const { Batsman, ...stat } = result
                return stat
            })
            res.render('response_stats.ejs', {img: 'batter', home: 3, stats, name: results[0]['Batsman']});
        })
    },
    response8: (req, res) => {
        let { "Batter-res": p1 } = req.body;
        if(p1 === undefined) {
            res.send("No player chosen")
            return
        }
        dBPool.query(`SELECT season as Season, batsman as Batsman, F1.match_id as Match_ID, team as Team, opp as Opponent, RunsScored, BallsFaced, ifnull(isDismissed, 0) as IsDismissed, (RunsScored*100)/BallsFaced as StrikeRate FROM 
        (SELECT season, batsman, match_id, any_value(team_name) as team, any_value(opponent) as opp, SUM(runs_scored) as RunsScored FROM (SELECT T2.season, T1.match_id, T3.player_name as batsman, T4.team_name, T5.team_name as opponent, T1.runs_scored FROM balls as T1 INNER JOIN matches as T2 inner join players as T3 inner join teams as T4 inner join teams as T5 ON T5.team_id = T1.team_bowling and T4.team_id = T1.team_batting and T3.player_id = T1.striker and T1.match_id = T2.match_id AND T1.striker = ` + String(p1) + `) as T3 GROUP BY match_id) AS F1 INNER JOIN 
        (SELECT match_id, COUNT(*) as BallsFaced FROM (SELECT T1.match_id, T1.bowler_extras FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.striker = ` + String(p1) + ` AND T1.bowler_extras = 0) as T3 GROUP BY match_id) AS F2 ON F1.match_id = F2.match_id LEFT JOIN 
        (SELECT match_id, COUNT(player_out) as isDismissed FROM (SELECT T1.match_id, T1.player_out FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.player_out = ` + String(p1) + `) as T3 GROUP BY match_id) AS F3 ON F2.match_id = F3.match_id ORDER BY match_id;`, (error, results, fields) => {
            if(error) {
                res.send(error)
                return
            }
            if(results.length === 0) {
                res.send("No relevant results")
                return
            }
            const stats = results.map((result) => {
                const { Batsman, ...stat } = result
                return stat
            })
            res.render('response_table.ejs', {img: 'batter', home: 3, name: results[0]['Batsman'], stats, headers: fields.map((field) => field.name).filter(name => name != "Batsman")});
        })
    },
    response9: (req, res) => {
        let { "Bowler-res": p1 } = req.body;
        if(p1 === undefined) {
            res.send("No player chosen")
            return
        }
        dBPool.query(`SELECT bowler as Bowler, F1.season as Season, team as Team, Innings, WicketsTaken, RunsGiven as RunsConceded, BallsBowled, BallsBowled/WicketsTaken as StrikeRate, RunsGiven/WicketsTaken as Average, (RunsGiven*6)/BallsBowled as Economy FROM 
        (SELECT bowler, season, any_value(team_name) as team, SUM(runs_scored) + SUM(bowler_extras) as RunsGiven FROM (SELECT T2.season, T4.player_name as bowler, T3.team_name, T1.runs_scored, T1.bowler_extras FROM balls as T1 INNER JOIN matches as T2 inner join teams as T3 inner join players as T4 ON T3.team_id = T1.team_bowling and T1.match_id = T2.match_id AND T1.bowler = ` + String(p1) + ` and T1.bowler = T4.player_id) as T3 GROUP BY season) as F1 INNER JOIN 
        (SELECT season, SUM(bowler_wicket) as WicketsTaken FROM (SELECT T2.season, T1.bowler_wicket FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.bowler = ` + String(p1) + `) as T3 GROUP BY season) AS F2 INNER JOIN 
        (SELECT season, COUNT(ball_id) as BallsBowled FROM (SELECT T2.season, T1.ball_id FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.bowler = ` + String(p1) + ` AND T1.bowler_extras = 0) as T3 GROUP BY season) AS F3 INNER JOIN 
        (SELECT season, COUNT(match_id) as Innings FROM (SELECT DISTINCT T2.season, T1.match_id FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.bowler = ` + String(p1) + `) as T3 GROUP BY season) AS F4 ON F1.season = F2.season AND F2.season = F3.season AND F3.season = F4.season ORDER BY season;`, (error, results, fields) => {
            if(error) {
                res.send(error)
                return
            }
            if(results.length === 0) {
                res.send("No relevant results")
                return
            }
            const stats = results.map((result) => {
                const { Bowler, ...stat } = result
                return stat
            })
            res.render('response_stats.ejs', {img: 'bowler', home: 3, stats, name: results[0]['Bowler']});
        })
    },
    response10: (req, res) => {
        let { "Bowler-res": p1 } = req.body;
        if(p1 === undefined) {
            res.send("No player chosen")
            return
        }
        dBPool.query(`SELECT season as Season, bowler as Bowler, F1.match_id as Match_ID, team as Team, opp as Opponent, RunsGiven as RunsConceded, BallsBowled, WicketsTaken, (RunsGiven*6)/BallsBowled as Economy FROM 
        (SELECT season, bowler, match_id, any_value(team_name) as team, any_value(opponent) as opp, SUM(runs_scored) + SUM(bowler_extras) as RunsGiven FROM (SELECT T2.season, T1.match_id, T3.player_name as bowler, T4.team_name, T5.team_name as opponent, T1.runs_scored, T1.bowler_extras FROM balls as T1 INNER JOIN matches as T2 inner join players as T3 inner join teams as T4 inner join teams as T5 ON T4.team_id = T1.team_bowling and T5.team_id = T1.team_batting and T3.player_id = T1.bowler and T1.match_id = T2.match_id AND T1.bowler = ` + String(p1) + `) as T3 GROUP BY match_id) as F1 INNER JOIN 
        (SELECT match_id, COUNT(ball_id) as BallsBowled FROM (SELECT T1.match_id, T1.ball_id FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.bowler = ` + String(p1) + ` AND T1.bowler_extras = 0) as T3 GROUP BY match_id) AS F2 ON F1.match_id = F2.match_id LEFT JOIN 
        (SELECT match_id, SUM(bowler_wicket) as WicketsTaken FROM (SELECT T1.match_id, T1.bowler_wicket FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.bowler = ` + String(p1) + `) as T3 GROUP BY match_id) AS F3 ON F2.match_id = F3.match_id ORDER BY match_id;`, (error, results, fields) => {
            if(error) {
                res.send(error)
                return
            }
            if(results.length === 0) {
                res.send("No relevant results")
                return
            }
            const stats = results.map((result) => {
                const { Bowler, ...stat } = result
                return stat
            })
            res.render('response_table.ejs', {img: 'bowler', home: 3, name: results[0]['Bowler'], stats, headers: fields.map((field) => field.name).filter(name => name != "Bowler")});
        })
    },
    response11: (req, res) => {
        let { "Fielder-res": p1 } = req.body;
        if(p1 === undefined) {
            res.send("No player chosen")
            return
        }
        dBPool.query(`SELECT F5.season as Season, fielder as Fielder, team as Team, ifnull(TotalDismissals, 0) as TotalDismissals, ifnull(Catches, 0) as Catches, ifnull(Stumpings, 0) as Stumpings, ifnull(Runouts, 0) as RunOuts FROM (SELECT fielder, F3.season, team, TotalDismissals, Catches, Stumpings FROM (SELECT fielder, F1.season, team, TotalDismissals, Catches FROM 
        (SELECT fielder, season, any_value(team_name) as team, COUNT(fielder) as TotalDismissals FROM (SELECT T2.season, T3.player_name as fielder, T4.team_name FROM balls as T1 INNER JOIN matches as T2 inner join players as T3 inner join teams as T4 ON T3.player_id = T1.fielder and T4.team_id = T1.team_bowling and T1.match_id = T2.match_id AND T1.fielder = ` + String(p1) + `) as T3 GROUP BY season) AS F1 LEFT JOIN 
        (SELECT season, COUNT(*) as Catches FROM (SELECT T2.season, T1.fielder, T1.team_bowling FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.fielder = ` + String(p1) + ` AND T1.out_type like "%ca%") as T3 GROUP BY season) AS F2 ON F1.season = F2.season) AS F3 LEFT JOIN 
        (SELECT season, COUNT(*) as Stumpings FROM (SELECT T2.season, T1.fielder, T1.team_bowling FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.fielder = ` + String(p1) + ` AND T1.out_type = "stumped") as T3 GROUP BY season) AS F4 ON F3.season = F4.season) AS F5 LEFT JOIN 
        (SELECT season, COUNT(*) as Runouts FROM (SELECT T2.season, T1.fielder, T1.team_bowling FROM balls as T1 INNER JOIN matches as T2 ON T1.match_id = T2.match_id AND T1.fielder = ` + String(p1) + ` AND T1.out_type = "run out") as T3 GROUP BY season) AS F6 ON F5.season = F6.season ORDER BY season;`, (error, results, fields) => {
            if(error) {
                res.send(error)
                return
            }
            if(results.length === 0) {
                res.send("No relevant results")
                return
            }
            const stats = results.map((result) => {
                const { Fielder, ...stat } = result
                return stat
            })
            res.render('response_stats.ejs', {img: 'fielder', home: 3, stats, name: results[0]['Fielder']});
        })
    }
}

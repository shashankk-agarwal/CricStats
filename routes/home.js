module.exports = {
    getHomePage: (req, res) => {
        buttons = [{name: "Bowlers by Wickets", id: 2}, {name: "Bowlers by Wickets", id: 3}, {name: "Batter vs Bowler", id: 1}, {name: "Compare Batting Stats", id: 4}, {name: "Compare Bowling Stats", id: 40}, {name: "Batting Stats by Season", id: 5}, {name: "Batting Stats by Match", id: 6}, {name: "Bowling Stats by Season", id: 7}, {name: "Bowling Stats by Match", id: 8}, {name: "Batting Stats by Season", id: 9}, {name: "Batting Stats by Match", id: 10}]
        res.render('homepage.ejs', {home: 0, buttons})
    },
    getHomeTab: (req, res) => {
        let tab = req.params.tab
        if(tab == 1) {
            buttons = [{name: "Batters by Runs", id: 2}, {name: "Bowlers by Wickets", id: 3}]
            res.render('home.ejs', {home: 1, buttons})
        }
        if(tab == 2) {
            buttons = [{name: "Batter vs Bowler", id: 1}, {name: "Compare Batting Stats", id: 4}, {name: "Compare Bowling Stats", id: 40}]
            res.render('home.ejs', {home: 2, buttons})
        }
        if(tab == 3) {
            buttons = [{name: "Batting Stats by Season", id: 5}, {name: "Batting Stats by Match", id: 6}, {name: "Bowling Stats by Season", id: 7}, {name: "Bowling Stats by Match", id: 8}]
            res.render('home.ejs', {home: 3, buttons})
        }
        if(tab == 4) {
            buttons = [{name: "Batting Stats by Season", id: 9}, {name: "Batting Stats by Match", id: 10}]
            res.render('home.ejs', {home: 4, buttons})
        }
    }
}

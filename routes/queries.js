module.exports = {
    query1: (req, res) => {
        console.log("Q1")
        res.render('query_compare.ejs', {p1: "Batter", p2: "Bowler", n: 1})
    },
    query2: (req, res) => {
        console.log("Q2")
        res.render('query2.ejs', {attributes: ['fours', 'sixes']})
    },
    query3: (req, res) => {
        console.log("Q3")
        res.render('query3.ejs', {attributes: ['fours', 'sixes']})
    },
    query4: (req, res) => {
        console.log("Q4")
        res.render('query_compare.ejs', {p1: "Player-1", p2: "Player-2", n: 4})
    },
    query5: (req, res) => {
        console.log("Q5")
        res.render('query_team.ejs', {n: 5})
    },
    query6: (req, res) => {
        console.log("Q6")
        res.render('query_team.ejs', {n: 6})
    },
    query7: (req, res) => {
        console.log("Q7")
        res.render('query_player.ejs', {n: 7, type: 'Batter'})
    },
    query8: (req, res) => {
        console.log("Q8")
        res.render('query_player.ejs', {n: 8, type: 'Batter'})
    },
    query9: (req, res) => {
        console.log("Q9")
        res.render('query_player.ejs', {n: 9, type: 'Bowler'})
    },
    query10: (req, res) => {
        console.log("Q10")
        res.render('query_player.ejs', {n: 10, type: 'Bowler'})
    },
}

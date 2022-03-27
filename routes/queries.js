module.exports = {
    query1: (req, res) => {
        console.log("Q1")
        res.render('query1.ejs', {})
    },
    query2: (req, res) => {
        console.log("Q2")
        res.render('query2.ejs', {attributes: ['fours', 'sixes']})
    },
    query3: (req, res) => {
        console.log("Q3")
        res.send('Q3')
    },
    query4: (req, res) => {
        console.log("Q4")
        res.send('Q4')
    },
    query5: (req, res) => {
        console.log("Q5")
        res.send('Q5')
    },
    query6: (req, res) => {
        console.log("Q6")
        res.send('Q6')
    }
}

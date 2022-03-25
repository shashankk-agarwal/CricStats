const { dBPool } = require('../services/db')
module.exports = {
    query1: (req, res) => {
        console.log("Q1")
        dBPool.query('SELECT * FROM Sample', (error, results, fields) => {
            console.log({results})
        })
        res.send('Q1')
    },
    query2: (req, res) => {
        console.log("Q2")
        res.send('Q2')
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

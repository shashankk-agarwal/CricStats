const { Router } = require('express')
const { getHomePage } = require('./home')
const { query1, query2, query3, query4, query5, query6 } = require('./queries')
const { searchPlayers, response1 } = require("./responses")
const homeRouter = new Router()
const queryRouter = new Router()
const responseRouter = new Router()
homeRouter.get('/', getHomePage)
queryRouter.get('/1', query1)
queryRouter.get('/2', query2)
queryRouter.get('/3', query3)
queryRouter.get('/4', query4)
queryRouter.get('/5', query5)
queryRouter.get('/6', query6)
responseRouter.get('/search', searchPlayers)
responseRouter.post('/1', response1)
module.exports = {homeRouter, queryRouter, responseRouter}

const mysql = require('mysql2')
const { dBConfig } = require('../config/db.config')
const dBPool = mysql.createPool(dBConfig)
module.exports = {dBPool}

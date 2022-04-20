const {Pool} = require("pg")
const DB_Connect = process.env.DB_Connection

const pool = new Pool({
    connectionString: DB_Connect
})

module.exports = {
    query: (text, params) => pool.query(text, params),
}


const postgres = require('pg')

const client = new postgres.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'phonestore',
    password: 'euvimdesantos',
    port: 5432
})

client.connect()

module.exports = client
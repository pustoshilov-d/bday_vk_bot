import { Pool, Client } from 'pg'

console.log('start')

let pool = new Client({
  connectionString:
    '',
  ssl: {
    sslmode: 'require',
    rejectUnauthorized: false,
  },
})
console.log('create')

pool.connect()
console.log('connect')

pool.query("SELECT 'message'", (err, res) => {
  console.log('end')
  console.log(err ? err : res.rows[0]) // Hello World!
  pool.end()
})

const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dbAlanFord',
  password: 'bazepodataka',
  port: 5432,
})

pool.connect(function(err) {
  if (err) throw err;
  console.log("Connected to the database");
});

module.exports = {
    query: (text, params) => {
        const start = Date.now();
        return pool.query(text, params)
            .then(res => {
                const duration = Date.now() - start;
                return res;
            });
    },
    pool: pool
}

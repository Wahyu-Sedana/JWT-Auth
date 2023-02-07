const mysql = require('mysql2');
require('dotenv').config();

const { DB_HOST, DB_USER, DB_DATABASE } = process.env;

const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: '',
  database: DB_DATABASE,
  multipleStatements: true,
});

connection.config.queryFormat = function (query, values) {
  if (!values) return query;
  /* eslint-disable-next-line */
  return query.replace(
    /\:(\w+)/g,
    function (txt, key) {
      /* eslint-disable-next-line */
      if (values.hasOwnProperty(key)) {
        return this.escape(values[key]);
      }
      return txt;
    }.bind(this)
  );
};

module.exports = {
  query(...args) {
    const statements = args.shift();
    return connection
      .promise()
      .query(Array.isArray(statements) ? statements.join(';') : statements, ...args)
      .then((res) => res[0]);
  },
  queryAll(...args) {
    const statements = args.shift();
    return connection
      .promise()
      .query(Array.isArray(statements) ? statements.join(';') : statements, ...args)
      .then((res) => res);
  },
  beginTransaction: connection.promise().beginTransaction,
  commit: connection.promise().commit,
  rollback: connection.promise().rollback,
};

connection.connect((err) => {
  if (err) {
    console.log('Database failed to connect!');
  }
});

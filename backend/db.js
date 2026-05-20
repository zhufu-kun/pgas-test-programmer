const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pgas_test"
});

connection.connect((err) => {
  if (err) {
    console.log("Database connection failed");
    return;
  }

  console.log("MySQL Connected");
});

module.exports = connection;

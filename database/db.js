const mysql = require("mysql2"),
  connection = mysql.createConnection({
    // host: `${process.env.DB_HOST}`,
    // user: `${process.env.DB_USER}`,
    // password: `${process.env.DB_PASS}`,
    // database: `${process.env.DB_DATABASE}`,
    // port: 3306
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "topicosweblogin",
    port: 3306,
  });

connection.connect((error) => {
  if (error) {
    console.log(`El error de conexión es: ${error}`);
    return;
  }
  console.log("Conectado a la base de datos");
});

module.exports = connection;

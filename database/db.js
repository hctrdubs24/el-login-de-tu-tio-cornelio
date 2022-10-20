const mysql = require("mysql2"),
  connection = mysql.createConnection({
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

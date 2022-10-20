const express = require("express"),
  app = express(),
  session = require("express-session"),
  connection = require("./database/db.js");

// Configuración para obtener datos del formulario
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Uso del directorio public
app.use("/resources", express.static("public"));
app.use("/resources", express.static(__dirname + "/public"));

// Establecer el motor de plantillas
app.set("view engine", "ejs");

// uso de sesiones
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Establecer rutas

// 1 - Autenticación de sesión
app.get("/", (req, res) => {
  if (req.session.loggedin) {
    res.render("index", {
      login: true,
      name: req.session.name,
    });
  } else {
    res.render("index", {
      login: false,
      name: "Debe iniciar sesión",
    });
  }
});

// 2 - Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

// Actualizar estado de la cuenta
const updateState = async (user) => {
  connection.query(
    "UPDATE musuario SET EdoCta = '0' WHERE NomUser = ?",
    [user],
    async (error, results) => {
      return;
    }
  );
};

// 3 - Autenticación de cuenta
app.post("/auth", async (req, res) => {
  const user = req.body.user,
    password = req.body.pass;
  if (user && password) {
    connection.query(
      "SELECT CvUser, CvPerso, NomUser, Contrasena, DATE_FORMAT(FechaIni,'%Y-%m-%d') as fechainicio, DATE_FORMAT(FechaFin,'%Y-%m-%d') as fechafin, EdoCta FROM musuario WHERE NomUser = ?",
      [user],
      async (err, results) => {
        if (results.length == 0) {
          res.render("login", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "El usuario no existe",
            alertIcon: "Error",
            showConfirmButton: true,
            timer: false,
            ruta: "login",
          });
        } else {
          if (results[0].EdoCta === 0) {
            res.render("login", {
              alert: true,
              alertTitle: "Error",
              alertMessage: "La cuenta se encuentra inactiva",
              alertIcon: "Error",
              showConfirmButton: true,
              timer: false,
              ruta: "login",
            });
          } else {
            let today = new Date(),
              dd = String(today.getDate()).padStart(2, "0"),
              mm = String(today.getMonth() + 1).padStart(2, "0"),
              yyyy = today.getFullYear();
            today = `${yyyy}-${mm}-${dd}`;

            let todayCom = new Date(today),
              fechafinCom = new Date(results[0].fechafin),
              fechainiCom = new Date(results[0].fechainicio);

            if (fechainiCom <= todayCom && fechafinCom >= todayCom) {
              if (password != results[0].Contrasena) {
                res.render("login", {
                  alert: true,
                  alertTitle: "Error",
                  alertMessage: "Contraseña incorrecta",
                  alertIcon: "Error",
                  showConfirmButton: true,
                  timer: false,
                  ruta: "login",
                });
              } else {
                req.session.loggedin = true;
                req.session.name = results[0].NomUser;
                res.render("login", {
                  alert: true,
                  alertTitle: "Conexión exitosa",
                  alertMessage: "Login correcto",
                  alertIcon: "Success",
                  showConfirmButton: false,
                  timer: 1500,
                  ruta: "",
                });
              }
            } else if (fechafinCom <= todayCom) {
              updateState(user);
              res.render("login", {
                alert: true,
                alertTitle: "Error",
                alertMessage:
                  "La cuenta ya alcanzó el límite de tiempo de actividad",
                alertIcon: "Error",
                showConfirmButton: true,
                timer: false,
                ruta: "login",
              });
            } else if (fechainiCom >= todayCom) {
              res.render("login", {
                alert: true,
                alertTitle: "Error",
                alertMessage:
                  "La cuenta aún no está activada, contacte al administrador",
                alertIcon: "Error",
                showConfirmButton: true,
                timer: false,
                ruta: "login",
              });
            }
          }
        }
      }
    );
  }
});

// Servidor
app.listen(3000, (req, res) => {
  console.log("El servidor está corriendo en http://localhost:3000");
});

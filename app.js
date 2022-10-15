const express = require("express"),
  app = express(),
  dotenv = require("dotenv"),
  session = require("express-session"),
  connection = require("./database/db.js");

// Configuración para obtener datos del formulario
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Uso de dotenv para variables de entorno
dotenv.config({ path: "./env/env" });

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

// Autenticación
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

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

// actualizar estado de la cuenta
const updateState = async (user) => {
  connection.query(
    "UPDATE musuario SET EdoCta = '0' WHERE NomUser = ?",
    [user],
    async (error, results) => {
      return;
    }
  );
};

// autenticación
app.post("/auth", async (req, res) => {
  const user = req.body.user,
    pass = req.body.pass;
  if (user && pass) {
    connection.query(
      "SELECT CvUser, CvPerso, NomUser, Contrasena, DATE_FORMAT(FechaIni,'%Y-%m-%d') as fechainicio, DATE_FORMAT(FechaFin,'%Y-%m-%d') as fechafin, EdoCta FROM musuario WHERE NomUser = ?",
      [user],
      async (error, results) => {
        let today = new Date(),
          dd = String(today.getDate()).padStart(2, "0"),
          mm = String(today.getMonth() + 1).padStart(2, "0"),
          yyyy = today.getFullYear();
        today = `${yyyy}-${mm}-${dd}`;

        let todayCom = new Date(today),
          fechafinCom = new Date(results[0].fechafin),
          fechainiCom = new Date(results[0].fechainicio);

        if (fechainiCom <= todayCom && fechafinCom >= todayCom) {
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
            if (results.length == 0 || pass != results[0].Contrasena) {
              res.render("login", {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Usuario o contraseña incorrectas",
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
        }

        //// aqui termina
      }
    );
  } else {
    res.render("login", {
      alert: true,
      alertTitle: "Advertencia",
      alertMessage: "Ingrese un usuario o contraseña",
      alertIcon: "warning",
      showConfirmButton: true,
      timer: 1500,
      ruta: "login",
    });
  } //// termina x2
});

app.listen(3000, (req, res) => {
  console.log("El servidor está corriendo en http://localhost:3000");
});

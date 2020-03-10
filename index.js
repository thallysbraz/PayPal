const express = require("express");

const bodyParser = require("body-parser");
const session = require("express-session");
require("dotenv/config");

const app = express(); //Instanciando server

app.set("view engine", "ejs"); //View engine

app.use(
  session({
    secret: process.env.SECRET,
    cookie: { maxAge: 30000000 },
    saveUninitialized: true,
    resave: true
  })
);

app.use(express.static("public")); //Arquivos staticos

//Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Router

app.get("/", (req, res) => {
  res.render("index.ejs");
});

const PORT = process.env.PORT || 8080;

// End Router
app.listen(PORT, () => {
  console.log(`O servidor está rodando na porta ${PORT}`);
});

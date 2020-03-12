const express = require("express");

const routes = express.Router();

const PaymentController = require("../src/Controllers/PaymentController");

routes.get("/", (req, res) => {
  res.render("index.ejs");
});

//rota para processar a compra
routes.post("/comprar", PaymentController.store);

//rota para processar o pagamento
routes.get("/final", PaymentController.confirmStore);

module.exports = routes;

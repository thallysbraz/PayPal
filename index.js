const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

require("dotenv/config");

const app = express(); //Instanciando server

const paypal = require("./config/PayPal");

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

//rota para processar a compra
app.post("/comprar", (req, res) => {
  var pagamento = {
    intent: "sale",
    payer: {
      payment_method: "paypal"
    },
    redirect_urls: {
      return_url: "http://localhost:3000/final",
      cancel_url: "http://localhost:3000"
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "Bola",
              sku: "bola_adidas",
              price: "5.00",
              currency: "BRL",
              quantity: 1
            }
          ]
        },
        amount: {
          currency: "BRL",
          total: "5.00"
        },
        description: "Bola da adidas"
      }
    ]
  };

  paypal.payment.create(pagamento, (error, payment) => {
    if (error) {
      return res.json(error);
    } else {
      //for pra fazer redirecionamento ... Implentar usando forEACH
      for (var i = 0; i < payment.links.length; i++) {
        var p = payment.links[i];
        if (p.rel === "approval_url") {
          console.log("p.re: ", p.href);
          res.redirect(p.href);
        }
      }
    }
  });
});

//rota para processar o pagamento
app.get("/final", async (req, res) => {
  //recebendo dados para processar o pagamento
  var payerId = req.query.PayerID;
  var paymentId = req.query.paymentId;
  console.log("paymentId: ", paymentId);
  console.log("Chegou no redirecionamento");
  //montando dados para pagamento
  var final = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "BRL",
          total: "5.00"
        }
      }
    ]
  };
  //processando pagamento
  paypal.payment.execute(paymentId, final, (err, payment) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(payment);
    }
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`O servidor está rodando na porta ${PORT}`);
});

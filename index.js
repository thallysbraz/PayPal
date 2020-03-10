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

app.post("/comprar", async (req, res) => {
  var pagamento = {
    intent: "sale",
    payer: {
      payment_method: "paypal"
    },
    redirect_urls: {
      return_url: "http://return.url",
      cancel_url: "http://cancel.url"
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
    }
    return res.json(payment);
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`O servidor está rodando na porta ${PORT}`);
});

const paypal = require("../../config/PayPal");

class PaymentController {
  //Store para criar pedido e pagamento
  async store(req, res) {
    var email = req.body.email;
    var id = req.body.id;

    var pagamento = {
      intent: "sale",
      payer: {
        payment_method: "paypal"
      },
      redirect_urls: {
        return_url: `http://localhost:3000/final?email=${email}&id=${id}`,
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
        console.log("Erro ao criar o pagamento");
        return res.json(error);
      } else {
        //for pra fazer redirecionamento ... Implentar usando forEACH
        for (var i = 0; i < payment.links.length; i++) {
          var p = payment.links[i];
          if (p.rel === "approval_url") {
            res.redirect(p.href);
          }
        }
      }
    });
  }

  //confirmStore para executar pagamento
  async confirmStore(req, res) {
    //recebendo dados para processar o pagamento
    var payerId = req.query.PayerID;
    var paymentId = req.query.paymentId;
    var email = req.query.email;
    var id = req.query.id;

    console.log(`http://localhost:3000/final?email=${email}&id=${id}`);
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
  }
}

module.exports = new PaymentController();

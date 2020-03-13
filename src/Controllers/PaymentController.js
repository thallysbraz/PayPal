const paypal = require("../../config/PayPal");

class PaymentController {
  //Store para criar pedido e pagamento
  async store(req, res) {
    var { email, produto, description, price, amount } = req.body;

    var total = price * amount;

    var pagamento = {
      intent: "sale",
      payer: {
        payment_method: "paypal"
      },
      redirect_urls: {
        return_url: `http://localhost:3000/final?produto=${produto}&price=${price}&amount=${amount}&total=${total}`,
        cancel_url: "http://localhost:3000"
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: produto,
                sku: produto,
                price: price,
                currency: "BRL",
                quantity: amount
              }
            ]
          },
          amount: {
            currency: "BRL",
            total: total
          },
          description: description
        }
      ]
    };
    return res.json(pagamento);
    /*paypal.payment.create(pagamento, (error, payment) => {
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
    });*/
  }

  //confirmStore para executar pagamento
  async confirmStore(req, res) {
    //recebendo dados para processar o pagamento
    var { produto, price, amount, total, payerId, paymentId } = req.query;

    console.log(
      `http://localhost:3000/final?produto=${produto}&price=${price}&amount=${amount}&total=${total}`
    );
    //montando dados para pagamento
    var final = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "BRL",
            total: total
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

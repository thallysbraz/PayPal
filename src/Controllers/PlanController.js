const paypal = require("../../config/PayPal");

class PlanController {
  async store(req, res) {
    //criar plano

    var plan = {
      name: "Plano A",
      description: "Plano barato",
      merchant_preferences: {
        auto_bill_amount: "yes", //cobrar automaticamente
        cancel_url: "http://www.cancel.com",
        return_url: "http://www.success.com",
        initial_fail_amount_action: "continue",
        max_fail_attempts: "1", //quantidade de tentativas para cobrar o cliente. No caso, com 2 ele ja cancela
        setup_fee: {
          currency: "BRL", //moeda
          value: "25" //taxa adicional
        }
      },
      payment_definitions: [
        {
          amount: {
            currency: "BRL",
            value: "10"
          },
          cycles: "0", //ciclo de 7 ...
          frequency: "DAY", // Dias
          frequency_interval: "1", //Repetir uma vez
          name: "Teste regular",
          type: "TRIAL"
        },
        {
          amount: {
            currency: "BRL",
            value: "24"
          },
          cycles: "0", //ciclo de 7 ...
          frequency: "MONTH", // Dias
          frequency_interval: "1", //Repetir uma vez
          name: "Teste final",
          type: "Regular"
        }
      ],
      type: "Infinite" //tempo que o plano fica ativo
    };
    paypal.billingPlan.create(plan, (err, plan) => {
      if (err) {
        return res.json(err);
      } else {
        return res.json(plan);
      }
    });
  }
}

module.exports = new PlanController();

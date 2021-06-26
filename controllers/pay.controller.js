const paypal = require("paypal-rest-sdk");
const address = require("../models/cofirmAddress.model")
const order = require("../models/order.model")
paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id: "ASio2urN0x9nZ65ki6cajANsdrFp6FePrQsywTX3O5rYeFonwzA5KSEkwy7612pCl6W97DAvlCDvEyGe",
    client_secret: "ENXthIPOAJCpilzz2GiYrM3tWroAqavJSgl_y_w9AMngSheEhS63vbwf3XP1JZhUuxbOr3HGOJ3jj2Ki",
});

exports.postPay = (req, res, next) => {

    address.getAddressDetails(req.session.userId)
        .then((shipp) => {

            order.getOrdersById(req.body.id)
                .then((orders) => {
                    req.session.orderId = req.body.id
                    const item1 = []
                    var i = 1
                    var sum = 0
                    var sum1 = 0
                    for (let order of orders[0].orderlist) {
                        if (order.name) {
                            sum1 = Number(order.price) + (order.price * 0.05) + 3

                            console.log(sum1)
                            item1.push({
                                name: order.name,
                                sku: i,
                                price: sum1,
                                currency: "USD",
                                quantity: order.amount,
                            })
                            i++
                            sum += sum1
                            sum1 = 0
                        }
                    }
                    req.session.sum = sum
                    console.log(item1)

                    const create_payment_json = {
                        intent: "sale",
                        payer: {
                            payment_method: "paypal",
                        },
                        redirect_urls: {
                            return_url: "http://127.0.0.1:3000/success",
                            cancel_url: "http://127.0.0.1:3000/cancel",
                        },
                        transactions: [{
                            item_list: {
                                "shipping_address": {
                                    "recipient_name": shipp[0].fullname,
                                    "line1": shipp[0].address1,
                                    "line2": shipp[0].address2,
                                    "city": shipp[0].city,
                                    "country_code": "BR",
                                    "postal_code": "18117-134",
                                    "state": shipp[0].state,
                                    "phone": shipp[0].phone
                                },
                                items: item1

                            },
                            amount: {
                                currency: "USD",
                                total: sum,

                            },
                            description: "Red Hat for the best team ever",
                        }, ],
                    };

                    paypal.payment.create(create_payment_json, function(error, payment) {
                        if (error) {
                            throw error;
                        } else {
                            for (let i = 0; i < payment.links.length; i++) {
                                if (payment.links[i].rel === "approval_url") {
                                    res.redirect(payment.links[i].href);
                                }
                            }
                        }
                    });
                })

        })


};
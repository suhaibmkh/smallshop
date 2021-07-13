const cartModel = require("../models/cart.model");
const orderModel = require("../models/order.model");

const validationResult = require("express-validator").validationResult;

exports.getOrderVerify = (req, res, next) => {
    cartModel
        .getItemById(req.query.order)
        .then(cartItem => {
            res.render("verify-order", {
                cart: cartItem,
                isUser: true,
                isAdmin: req.session.isAdmin,
                pageTitle: "Verify Order",
                validationError: req.flash("validationErrors")[0]
            });
        })
        .catch(err => res.redirect("/error"));
};

exports.getOrder = (req, res, next) => {
    console.log(req.body)
    orderModel
        .getOrdersByUser(req.session.userId)
        .then(items => {
            res.render("orders", {
                pageTitle: "Orders",
                isUser: true,
                isAdmin: req.session.isAdmin,
                items: items,

            });
        })
        .catch(err => res.redirect("/error"));
};

exports.postOrder = (req, res, next) => {


    if (validationResult(req).isEmpty()) {

        orderModel

            .addNewOrder(req.body)
            .then(() => res.redirect("/orders"))
            .catch(err => {
                res.redirect("/error");
            });
    } else {
        req.flash("validationErrors", validationResult(req).array());
        res.redirect("/verify-order?order=" + req.body.cartId);
    }
};

exports.postCancel = (req, res, next) => {
    console.log("route is Ok")
    orderModel
        .cancelOrder(req.body.id)
        .then(() => res.redirect("/orders"))
        .catch(err => {
            res.redirect("/error");
        });
};
exports.postCancel1 = (req, res, next) => {
    console.log(req.body.cancelOrder)
    orderModel
        .cancelOrder(req.body.cancelorder)
        .then(() => res.redirect("/orders"))
        .catch(err => {
            res.redirect("/error");
        });
};
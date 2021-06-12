const cartModel = require("../models/cart.model");
const validationResult = require("express-validator").validationResult;

exports.getCart = (req, res, next) => {
    cartModel
        .getItemsByUser(req.session.userId)
        .then(items => {
            res.render("cart", {
                items: items,
                isUser: true,
                userId: req.session.userId,
                isAdmin: req.session.isAdmin,
                address: req.session.address,
                phone: req.session.phone,
                pageTitle: "Cart",
                total: 0
            });
        })
        .catch(err => {
            res.redirect("/error");
        });
};

exports.postCart = (req, res, next) => {
    if (validationResult(req).isEmpty()) {
        cartModel
            .addNewItem({
                name: req.body.name,
                price: req.body.price,
                image: req.body.image,
                amount: req.body.amount,
                productId: req.body.productId,
                description: req.body.description,
                userId: req.session.userId,
                timestamp: Date.now()
            })
            .then(() => {
                res.redirect("/cart");
            })
            .catch(err => {
                res.redirect("/error");
            });
    } else {
        req.flash("validationErrors", validationResult(req).array());
        res.redirect(req.body.redirectTo);
    }
};

exports.postSave = (req, res, next) => {
    if (validationResult(req).isEmpty()) {
        cartModel

            .editItem(req.body.cartId, {
                amount: req.body.amount,
                timestamp: Date.now()
            })
            .then(() => res.redirect("/cart"))
            .catch(err => res.redirect("/error"));
    } else {
        req.flash("validationErrors", validationResult(req).array());
        res.redirect("/cart");
    }
};

exports.postDelete = (req, res, next) => {
    cartModel
        .deleteItem(req.body.cartId)
        .then(() => res.redirect("/cart"))
        .catch(err => res.redirect("/error"));
};
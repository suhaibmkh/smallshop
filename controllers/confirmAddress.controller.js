const confirmAddressModel = require("../models/auth.model");
const validationResult = require("express-validator").validationResult;

exports.postConfirmAddress1 = (req, res, next) => {

    if (validationResult(req).isEmpty()) {

        confirmAddressModel
            .addNewAddress({
                fullname: req.body.fullname,
                address1: req.body.address1,
                address2: req.body.address2,
                country: req.body.country,
                state: req.body.state,
                city: req.body.city,
                phone: req.body.phone,
                zip: req.body.zip,
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
        res.redirect("/shippingaddress");
    }
};
exports.getConfirminstruction = (req, res, next) => {

    res.render("instruction", {
        isUser: req.session.userId,
        isAdmin: req.session.isAdmin,

        pageTitle: "Instructions"
    })
}
exports.postConfirmAddress = (req, res, next) => {
    console.log("req.body", req.body)
    if (validationResult(req).isEmpty()) {

        confirmAddressModel
            .updateAddress({
                id: req.body.id,
                fullname: req.body.fullname,
                country: req.body.country,
                city: req.body.city,
                state: req.body.state,
                address1: req.body.address1,
                address2: req.body.address2,




                zip: req.body.zip,
                phone: req.body.phone,
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
        res.redirect("/shippingaddress");
    }
};
exports.postConfirminstruction = (req, res, next) => {
    console.log("req", req.session.userId)

    if (validationResult(req).isEmpty()) {

        confirmAddressModel
            .updateInstruction(req.body.instruction, req.session.userId)
            .then(() => {
                res.redirect("/cart");
            })
            .catch(err => {
                res.redirect("/error");
            });
    } else {
        req.flash("validationErrors", validationResult(req).array());
        res.redirect("/shippingaddress");
    }
};
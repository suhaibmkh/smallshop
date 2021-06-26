const confirmAddressModel = require("../models/cofirmAddress.model");
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
exports.postConfirmAddress = (req, res, next) => {
    console.log(req.body)
    if (validationResult(req).isEmpty()) {

        confirmAddressModel
            .updateAddress({
                id: req.body.id,
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
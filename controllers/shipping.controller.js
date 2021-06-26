const validationResult = require("express-validator").validationResult;
exports.getShippingAddress = (req, res, next) => {
    console.log(req.body)
    res.render("shippingAddress", {
        address: req.body,
        isUser: true,
        isAdmin: req.session.isAdmin,
        validationErrors: req.flash("validationErrors"),
        pageTitle: "Shipping To"
    })
}
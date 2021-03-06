const productsModel = require("../models/products.model");

exports.getProduct = (req, res, next) => {
    productsModel
        .getFirstProduct()
        .then(product => {
            res.render("product", {
                user: req.session.userId,
                product: product,
                isUser: req.session.userId,
                isAdmin: req.session.isAdmin,
                pageTitle: "Product Details"
            });
        })
        .catch(err => res.redirect("/error"));
};
exports.deleteItem = (req, res, next) => {

    productsModel.deleteProductById(req.body.productId)
        .then(() => {
            res.redirect("/")
        })
}

exports.getProductById = (req, res, next) => {
    let id = req.params.id;
    productsModel
        .getProductById(id)
        .then(product => {
            res.render("product", {
                user: req.session.userId,
                product: product,
                isUser: req.session.userId,
                isAdmin: req.session.isAdmin,
                pageTitle: product.name
            });
        })
        .catch(err => res.redirect("/error"));
};
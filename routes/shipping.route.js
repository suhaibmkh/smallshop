const router = require("express").Router();
const bodyParser = require("body-parser");

const check = require("express-validator").check;
const authGuard = require("./guards/auth.guard");
const shippingController = require("../controllers/shipping.controller")
router.post('/', authGuard.isAuth, bodyParser.urlencoded({ extended: true }), shippingController.getShippingAddress);

module.exports = router;
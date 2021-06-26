const router = require("express").Router();
const bodyParser = require("body-parser");
const payController = require("../controllers/pay.controller")

router.post("/", bodyParser.urlencoded({ extended: true }), payController.postPay)
module.exports = router;
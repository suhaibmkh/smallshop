const router = require("express").Router();
const bodyParser = require("body-parser");
const check = require("express-validator").check;
const verifyController = require("../controllers/auth.controller")

router.post("/", bodyParser.urlencoded({ extended: true }), verifyController.activereset)


module.exports = router;
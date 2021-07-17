const router = require("express").Router();
const bodyParser = require("body-parser");
const verifyController = require("../controllers/auth.controller")
router.get("/", bodyParser.urlencoded({ extended: true }), verifyController.activeacc)
module.exports = router;
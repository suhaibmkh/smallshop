const router = require("express").Router();
const bodyParser = require("body-parser");
const productController = require("../controllers/product.controller");
const adminGuard = require("./guards/admin.guard");

router.post("/", adminGuard, bodyParser.urlencoded({ extended: true }), productController.deleteItem);


module.exports = router;
const router = require("express").Router();
const bodyParser = require("body-parser");
const check = require("express-validator").check;

const orderController = require("../controllers/order.constroller");
const authGuard = require("./guards/auth.guard");

router.get("/", authGuard.isAuth, orderController.getOrder);

router.post(
    "/",
    authGuard.isAuth,
    bodyParser.urlencoded({ extended: true }),

    orderController.postOrder
);


router.post(
    "/cancel",
    authGuard.isAuth,
    bodyParser.urlencoded({ extended: true }),
    orderController.postCancel
);

module.exports = router;

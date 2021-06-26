const router = require("express").Router();
const bodyParser = require("body-parser");

const check = require("express-validator").check;
const authGuard = require("./guards/auth.guard");
const confirmAddressController = require("../controllers/confirmAddress.controller")
router.post('/', authGuard.isAuth,
    bodyParser.urlencoded({ extended: true }),
    check("fullname").not().isEmpty().withMessage("Full Name is required"),
    check("country").not().isEmpty().withMessage("Counrty is required"),
    check("state").not().isEmpty().withMessage("state is required"),
    check("city").not().isEmpty().withMessage("City is required"),
    check("address1").not().isEmpty().withMessage("Address is required"),
    check("phone").not().isEmpty().withMessage("Phone is required"),
    check("zip").not().isEmpty().withMessage("ZIP is required"),
    confirmAddressController.postConfirmAddress);


module.exports = router;
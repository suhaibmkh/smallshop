const router = require("express").Router();
const bodyParser = require("body-parser");

const check = require("express-validator").check;
const authGuard = require("./guards/auth.guard");
const confirmAddressController = require("../controllers/confirmAddress.controller")
router.post('/', authGuard.isAuth,
    bodyParser.urlencoded({ extended: true }),
    check("fullname").not().isEmpty().withMessage("Full Name is required"),
    check("country").not().isEmpty().withMessage("Country is required"),
    check("state").not().isEmpty().withMessage("state is required"),
    check("city").not().isEmpty().withMessage("City is required"),
    check("address1").not().isEmpty().withMessage("Address is required"),

    check("zip").not().isEmpty().withMessage("ZIP Code is required"),
    check("phone").not().isEmpty().withMessage("Phone is required"),
    confirmAddressController.postConfirmAddress);
router.post('/confirminstruction', authGuard.isAuth,
    bodyParser.urlencoded({ extended: true }),

    confirmAddressController.postConfirminstruction);
router.get('/confirminstruction', authGuard.isAuth,

    confirmAddressController.getConfirminstruction);

module.exports = router;
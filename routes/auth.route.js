const router = require("express").Router();
const bodyParser = require("body-parser");
const check = require("express-validator").check;

const authGuard = require("./guards/auth.guard");

const authController = require("../controllers/auth.controller");

router.get("/signup", authGuard.notAuth, authController.getSignup);

router.post(
    "/signup",
    authGuard.notAuth,
    bodyParser.urlencoded({ extended: true }),
    check("username")
    .not()
    .isEmpty()
    .withMessage("username is required"),
    check("fullname")
    .not()
    .isEmpty()
    .withMessage("Full Name is required"),

    check("country")
    .not()
    .isEmpty()
    .withMessage("Country is required"),
    check("city")
    .not()
    .isEmpty()
    .withMessage("City is required"),
    check("state")
    .not()
    .isEmpty()
    .withMessage("State is required"),
    check("address1")
    .not()
    .isEmpty()
    .withMessage("Line 1 is required"),
    check("phone")
    .not()
    .isEmpty()
    .withMessage("Phone is required"),
    check("zip")
    .not()
    .isEmpty()
    .withMessage("ZIP Code is required"),
    check("email")
    .not()
    .isEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid format"),
    check("password")
    .not()
    .isEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 charachters"),
    check("confirmPassword").custom((value, { req }) => {
        if (value === req.body.password) return true;
        else throw "passwords dont equal";
    }),
    authController.postSignup
);

router.get("/login", authGuard.notAuth, authController.getLogin);

router.post(
    "/login",
    authGuard.notAuth,
    bodyParser.urlencoded({ extended: true }),
    check("email")
    .not()
    .isEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid format"),
    check("password")
    .not()
    .isEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 charachters"),
    authController.postLogin
);
router.get('/forgot', authController.getForgotPassword);
router.post("/resetpass1",
    bodyParser.urlencoded({ extended: true }),
    check("password")
    .not()
    .isEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 charachters"),
    check("confirmPassword").custom((value, { req }) => {
        if (value === req.body.password) return true;
        else throw "passwords dont equal";
    }),
    authController.resetPass
)

router.all("/logout", authGuard.isAuth, authController.logout);

module.exports = router;
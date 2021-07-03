const router = require("express").Router();
const check = require("express-validator").check;
const multer = require("multer");
const bodyParser = require("body-parser");

const adminController = require("../controllers/admin.controller");
const adminGuard = require("./guards/admin.guard");

router.get("/add", adminGuard, adminController.getAdd);

router.post(
    "/add",
    adminGuard,
    multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, "images/");
            },
            filename: (req, files, cb) => {
                cb(null, Date.now() + "-" + files.originalname);

            }
        })
    }).array("image", 5),
    check("name")
    .not()
    .isEmpty()
    .withMessage("name is required"),
    check("price")
    .not()
    .isEmpty()
    .withMessage("price is required")
    .isFloat({ min: 0.0000000009 })
    .withMessage("price must be greater than 0"),
    check("description")
    .not()
    .isEmpty()
    .withMessage("description is required"),
    check("category")
    .not()
    .isEmpty()
    .withMessage("category is required"),
    check("image").custom((value, { req }) => {
        if (req.files) return true;
        else throw "image is required";
    }),
    adminController.postAdd
);

router.get("/orders", adminGuard, adminController.getOrders);
router.post("/orders/oneorder", adminGuard, bodyParser.urlencoded({ extended: true }), adminController.getOneOrder);
router.post(
    "/orders",
    adminGuard,
    bodyParser.urlencoded({ extended: true }),
    adminController.postOrders
);
router.post(
    "/send",
    adminGuard,
    bodyParser.urlencoded({ extended: true }),
    adminController.postOrders
);

module.exports = router;
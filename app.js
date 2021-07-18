const express = require("express");
const path = require("path");

const session = require("express-session");
const SessionStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");

const homeRouter = require("./routes/home.route");
const productRouter = require("./routes/product.route");
const authRouter = require("./routes/auth.route");
const cartRouter = require("./routes/cart.route");
const adminRouter = require("./routes/admin.route");
const orderRouter = require("./routes/orders.route");
const shippingRouter = require("./routes/shipping.route");
const confirmAddressRouter = require("./routes/confirmAddress.route")
const payRoute = require("./routes/pay.route")
const verifyRoute = require("./routes/verify.route")
const resetRoute = require("./routes/reset.route")
const paypal = require("paypal-rest-sdk");
const order = require("./models/order.model")

paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id: "ASio2urN0x9nZ65ki6cajANsdrFp6FePrQsywTX3O5rYeFonwzA5KSEkwy7612pCl6W97DAvlCDvEyGe",
    client_secret: "ENXthIPOAJCpilzz2GiYrM3tWroAqavJSgl_y_w9AMngSheEhS63vbwf3XP1JZhUuxbOr3HGOJ3jj2Ki",
});



const app = express();

app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "images")));
app.use(flash());

const STORE = new SessionStore({
    uri: "mongodb+srv://suhaib-khater_80:Galaxy-sm1@cluster0.vzcs0.mongodb.net/online-shop?retryWrites=true&w=majority",
    collection: "sessions"
});

app.use(
    session({
        secret: "this is my secret secret to hash express sessions ......",
        saveUninitialized: false,
        store: STORE
    })
);

app.set("view engine", "ejs");
app.set("views", "views");
app.use("/", homeRouter);
app.use("/", authRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/admin", adminRouter);
app.use("/", orderRouter);
app.use("/shippingaddress", shippingRouter);
app.use("/confirmaddress", confirmAddressRouter);
app.use("/update", confirmAddressRouter);
app.use("/pay", payRoute)
app.use('/verify', verifyRoute);

app.use("/resetpass", resetRoute)

app.get("/success", (req, res, next) => {

    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        payer_id: payerId,
        transactions: [{
            amount: {
                currency: "USD",
                total: req.session.sum,
            },
        }, ],
    };

    paypal.payment.execute(paymentId, execute_payment_json, function(
        error,
        payment
    ) {

        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            console.log(req.session.id);
            order.updatePay(req.session.orderId)
            res.redirect("/orders")
        }
    });

});

app.get("/cancel", (req, res) => res.send("Cancelled"));

app.get("/error", (req, res, next) => {
    res.status(500);
    res.render("error.ejs", {
        isUser: req.session.userId,
        isAdmin: req.session.isAdmin,
        pageTitle: "Error"
    });
});

app.get("/not-admin", (req, res, next) => {
    res.status(403);
    res.render("not-admin", {
        isUser: req.session.userId,
        isAdmin: false,
        pageTitle: "Not Allowed"
    });
});

app.use((req, res, next) => {
    res.status(404);
    res.render("not-found", {
        isUser: req.session.userId,
        isAdmin: req.session.isAdmin,
        pageTitle: "Page Not Found"
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("server listen on port " + port);
});
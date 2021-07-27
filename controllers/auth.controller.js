const authModel = require("../models/auth.model");
const validationResult = require("express-validator").validationResult;

const nodemailer = require("nodemailer")
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const JWT_KEY = "jwtactive987";
const JWT_RESET_KEY = "jwtreset987";


exports.getSignup = (req, res, next) => {
    res.render("signup", {
        user: req.session.userId,
        authError: req.flash("authError")[0],
        validationErrors: req.flash("validationErrors"),
        isUser: false,
        isAdmin: false,
        pageTitle: "Signup"
    });
};


exports.postSignup = (req, res, next) => {

    if (validationResult(req).isEmpty()) {
        authModel
            .createNewUser(req.headers.host, req.body.username, req.body.email, req.body.password, req.body.fullname, req.body.country, req.body.state, req.body.city, req.body.address1, req.body.address2, req.body.zip, req.body.phone[0], req.body.instruction)
            .then(() => res.render("activate", {
                user: req.session.userId,

                isUser: false,
                isAdmin: false,
                pageTitle: "Active Account"
            }))
            .catch(err => {
                req.flash("authError", err);
                res.redirect("/signup");
            });
    } else {
        req.flash("validationErrors", validationResult(req).array());
        res.redirect("/signup");
    }
};

exports.getLogin = (req, res, next) => {
    res.render("login", {
        user: req.session.userId,
        authError: req.flash("authError")[0],
        validationErrors: req.flash("validationErrors"),
        isUser: false,
        isAdmin: false,
        pageTitle: "Login"
    });
};
exports.activeacc = (req, res, next) => {
    authModel.active(req)
    res.redirect('/login');
}
exports.activereset = (req, res, next) => {

    const oauth2Client = new OAuth2(
        "162484603628-bosm28e7at0e3mti7qlpjf9u632sduik.apps.googleusercontent.com", // ClientID
        "OmfWXvV3V7kSN_r5eyNmKzFZ", // Client Secret
        "https://suhaib-shop.herokuapp.com/" // Redirect URL
    );

    oauth2Client.setCredentials({
        refresh_token: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w"
    });
    const accessToken = oauth2Client.getAccessToken()
    const email = req.body.email
    const token = jwt.sign({ email }, JWT_KEY, { expiresIn: '30m' });


    const host = 'http://' + req.headers.host;

    const link = host + "/verify/verifyreset?id=" + token

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: "OAuth2",
            user: "onlineshopkeyboard@gmail.com",
            clientId: "162484603628-bosm28e7at0e3mti7qlpjf9u632sduik.apps.googleusercontent.com",
            clientSecret: "OmfWXvV3V7kSN_r5eyNmKzFZ",
            refreshToken: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w",

        },
    });
    const mailOptions = {
        from: '"Auth Admin" <onlineshopkeyboard@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Resert Password ✔", // Subject line
        generateTextFromHTML: true,
        html: "Hello,<br> Please Click on the link to Resert your password.<br><a href=" + link + ">Click here to reset password</a>"
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {

            req.flash(
                'error_msg',
                'Something went wrong on our end. Please register again.'
            );
            res.redirect('/signup');
        } else {
            console.log('Mail sent : %s', info.response);
            req.flash(
                'success_msg',
                'Activation link sent to email ID. Please activate to log in.'
            );
            res.render("activepass", {
                user: req.session.userId,
                authError: req.flash("authError")[0],
                validationErrors: req.flash("validationErrors"),
                isUser: false,
                isAdmin: false,
                pageTitle: "Login"
            });
        }
    })
}

exports.getForgotPassword = (req, res, next) => {


    res.render("forgot", {
        user: req.session.userId,
        isUser: false,
        isAdmin: false,
        pageTitle: "Change Paassword"
    })
}
exports.resetPass = (req, res, next) => {

    if (validationResult(req).isEmpty()) {
        authModel.resetP(req)
        res.redirect("/login")
    } else {
        req.flash("validationErrors", validationResult(req).array());
        res.redirect("/error");
    }
}
exports.getFpage = (req, res, next) => {

    const token = req.query.id;

    let errors = [];
    if (token) {
        jwt.verify(token, JWT_KEY, (err, decodedToken) => {

            if (err) {
                req.flash("authError", 'Incorrect or expired link! Please register again.');


            } else {
                res.render("forgotr", {
                    user: req.session.userId,
                    authError: req.flash("authError")[0],
                    validationErrors: req.flash("validationErrors"),
                    isUser: false,
                    isAdmin: false,
                    email: decodedToken.email,
                    pageTitle: "Confirm new password"
                })
            }
        })
    } else {
        res.redirect("/error");
    }

}
exports.postLogin = (req, res, next) => {

    if (validationResult(req).isEmpty()) {
        authModel
            .login(req.body.email, req.body.password)
            .then(result => {

                req.session.userId = result.id;

                req.session.isAdmin = result.isAdmin;
                res.redirect("/");
            })
            .catch(err => {
                req.flash("authError", err);
                res.redirect("/login");
            });
    } else {
        req.flash("validationErrors", validationResult(req).array());
        res.redirect("/login");
    }
};

exports.logout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
};

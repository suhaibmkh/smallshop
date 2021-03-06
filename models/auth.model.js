const mongoose = require("mongoose");
const nodemailer = require("nodemailer")
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const JWT_KEY = "jwtactive987";
const JWT_RESET_KEY = "jwtreset987";

const DB_URL =
    "mongodb+srv://suhaib-khater_80:Galaxy-sm1@cluster0.vzcs0.mongodb.net/online-shop?retryWrites=true&w=majority";
const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    valid: {
        type: Boolean,
        default: false
    },
    fullname: String,
    country: String,
    state: String,
    city: String,
    address1: String,
    address2: String,
    zip: String,
    phone: String,
    instruction: String
});

const User = mongoose.model("acct", userSchema);



exports.createNewUser = (host1, username, email, password, fullname, country, state, city, address1, address2, zip, phone, instruction) => {

    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                return User.findOne({ email: email });
            })
            .then(user => {
                if (user) {
                    mongoose.disconnect();
                    reject("email is used");
                } else {


                    return bcrypt.hash(password, 10);
                }
            })
            .then(hashedPassword => {

                let user = new User({
                    username: username,
                    email: email,
                    address1: address1,
                    address2: address2,
                    country: country,
                    state: state,
                    city: city,
                    fullname: fullname,
                    zip: zip,
                    instruction: instruction,
                    phone: phone,
                    password: hashedPassword
                });







                const token = jwt.sign({ username, email, password }, JWT_KEY, { expiresIn: '30m' });


                const host = 'http://' + host1;

                const link = host + "/verify?id=" + token

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {

                        user: "onlineshopkeyboard@gmail.com",
                        pass: "Galaxy-so1"

                    },
                });
                const mailOptions = {
                    from: '"Auth Admin" <onlineshopkeyboard@gmail.com>', // sender address
                    to: email, // list of receivers
                    subject: "Account Verification:???", // Subject line
                    generateTextFromHTML: true,
                    html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
                }

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
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

                    }
                })
                return user.save();
            })
            .then(() => {
                mongoose.disconnect();
                resolve();
            })
            .catch(err => {
                mongoose.disconnect();
                reject(err);
            });
    });
};

exports.updateInstruction = (data, email) => {

    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {


                return User.findOneAndUpdate({ email: email }, { instruction: data })

            })
            .then(() => {
                console.log()
                mongoose.disconnect();
                resolve();
            })
            .catch(err => {
                mongoose.disconnect();
                reject(err);
            });
    });
}
exports.updateAddress = data => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {

                return User.findOneAndUpdate({ email: data.userId }, { fullname: data.fullname, country: data.country, state: data.state, city: data.city, address1: data.address1, address2: data.addresses2, zip: data.zip, phone: data.phone })

            })
            .then(() => {
                mongoose.disconnect();
                resolve();
            })
            .catch(err => {
                mongoose.disconnect();
                reject(err);
            });
    });
}
exports.postConfirmAddress = (req, res, next) => {
    console.log(req.body)
    if (validationResult(req).isEmpty()) {

        User
            .updateAddress({
                id: req.body.id,
                fullname: req.body.fullname,
                address1: req.body.address1,
                address2: req.body.address2,
                country: req.body.country,
                state: req.body.state,
                city: req.body.city,
                phone: req.body.phone,
                zip: req.body.zip,
                userId: req.session.userId,
                timestamp: Date.now()
            })
            .then(() => {
                res.redirect("/cart");
            })
            .catch(err => {
                res.redirect("/error");
            });
    } else {
        req.flash("validationErrors", validationResult(req).array());
        res.redirect("/shippingaddress");
    }
};

exports.login = (email, password) => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => User.findOne({ email: email }))
            .then(user => {
                if (!user) {
                    mongoose.disconnect();
                    reject("there is no user matches this email");
                } else {
                    bcrypt.compare(password, user.password).then(same => {
                        if (!same) {
                            mongoose.disconnect();
                            reject("password is incorrect");
                        } else if (!user.valid) {
                            mongoose.disconnect();
                            reject("your Email not activate");
                        } else {
                            mongoose.disconnect();
                            resolve({
                                id: user.email,
                                address: user.address,
                                phone: user.phone,
                                isAdmin: user.isAdmin
                            });
                        }
                    });
                }
            })
            .catch(err => {
                mongoose.disconnect();
                reject(err);
            });
    });
};
exports.getUserById = Id => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => User.findOne({ email: Id }))
            .then(user => {
                mongoose.disconnect();
                resolve(user);
            }).catch(err => {
                mongoose.disconnect();
                reject(err);
            });
    })

}
exports.active = (req) => {


    const token = req.query.id;

    let errors = [];
    if (token) {
        jwt.verify(token, JWT_KEY, (err, decodedToken) => {

            if (err) {
                req.flash(
                    'error_msg',
                    'Incorrect or expired link! Please register again.'
                );

            } else {
                const { name, email, password } = decodedToken;
                return new Promise((resolve, reject) => {
                    mongoose
                        .connect(DB_URL)
                        .then(() => User.findOneAndUpdate({ email: email }, { valid: true }))
                        .then((user) => {

                            mongoose.disconnect();
                            resolve();

                        }).catch(err => {
                            mongoose.disconnect();
                            reject(err);
                        })

                })


            }

        })
    } else {
        console.log("Account activation error!")
    }

}
exports.resetP = data => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                return bcrypt.hash(data.body.password, 10);
            })
            .then((hashpass) => {
                return User.updateOne({ email: data.body.email }, { password: hashpass })
                    .then(items => {
                        mongoose.disconnect();
                        resolve();
                    })

                .catch(err => {
                    mongoose.disconnect();
                    reject(err);
                });

            });
    });
}
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const DB_URL =
    "mongodb+srv://suhaib-khater_80:Galaxy-sm1@cluster0.vzcs0.mongodb.net/online-shop?retryWrites=true&w=majority";
const userSchema = mongoose.Schema({
    username: String,
  
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
   
    email: { type: String, unique: true },
    roles: [{ type: 'String' }],
    isVerified: { type: Boolean, default: false },
  
    passwordResetToken: String,
    passwordResetExpires: Date
});
const tokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});

const User = mongoose.model("user", userSchema);
const Token = mongoose.model("token", tokenSchema);
exports.createNewUser = (username, email, password) => {
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
                    password: hashedPassword
                });
                user.save(function (err) {
                    if (err) { return res.status(500).send({ msg: err.message }); }
             
                    // Create a verification token for this user
                    var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
             
                    // Save the verification token
                    token.save(function (err) {
                        if (err) { return res.status(500).send({ msg: err.message }); }
             
                        // Send the email
                        var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
                        var mailOptions = { from: 'no-reply@yourwebapplication.com', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
                        transporter.sendMail(mailOptions, function (err) {
                            if (err) { return res.status(500).send({ msg: err.message }); }
                            res.status(200).send('A verification email has been sent to ' + user.email + '.');
                        });
                    });
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
});
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
                        } else {
                            mongoose.disconnect();
                            resolve({
                                id: user.email,
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

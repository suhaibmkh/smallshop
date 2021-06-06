const mongoose = require("mongoose");
const bcrypt = require("bcrypt");



const nodemailer = require("nodemailer");


const DB_URL =
    "mongodb+srv://suhaib-khater_80:Galaxy-sm1@cluster0.vzcs0.mongodb.net/online-shop?retryWrites=true&w=majority";
const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
});
const User = mongoose.model("acct", userSchema);


var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "suhaib0@gmail.com",
        pass: "Galaxy-sM1"
    }
});
var rand,mailOptions,host,link;




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
                     rand=Math.floor((Math.random() * 100) + 54);
    host=req.get('host');
    link="http://"+req.get('host')+"/verify?id="+rand;
    mailOptions={
        to : req.body.email,
        subject : "Please confirm your Email account",
        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
            console.log(error);
        res.end("error");
     }else{
            console.log("Message sent: " + response.message);
        res.end("sent");
         }
});
                    
                    
                    return bcrypt.hash(password, 10);
                }
            })
            .then(hashedPassword => {
                let user = new User({
                    username: username,
                    email: email,
                    password: hashedPassword
                });
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

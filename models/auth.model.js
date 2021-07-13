const mongoose = require("mongoose");
	

	const bcrypt = require("bcrypt");
	

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
	

	exports.createNewUser = (username, email, password, fullname, country, state, city, address1, address2, zip, phone, instruction) => {
	

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
	    console.log(data)
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
	                console.log("Data", data)
	                console.log(" req.session.userId", data.userId)
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


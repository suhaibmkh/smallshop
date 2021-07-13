const mongoose = require("mongoose");

const DB_URL =
    "mongodb+srv://suhaib-khater_80:Galaxy-sm1@cluster0.vzcs0.mongodb.net/online-shop?retryWrites=true&w=majority";
const confirmAddressSchema = mongoose.Schema({
    fullname: String,
    userId: String,
    phone: String,
    address1: String,
    address2: String,
    country: String,
    city: String,
    state: String,
    zip: String,
    timestamp: Number,
    instructions: String,
});

const Address = mongoose.model("address", confirmAddressSchema);
exports.addNewAddress = data => {

    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                let item = new Address(data);
                return item.save();
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
exports.updateAddress = data => {
    console.log("data", data)
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                return Address.findOneAndUpdate({ _id: data.id }, { fullname: data.fullname, country: data.country, state: data.state, city: data.city, address1: data.address1, address2: data.addresses2, zip: data.zip, phone: data.phone })

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
exports.updateInstruction = data => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL, { useFindAndModify: false })
            .then(() => {
                console.log("1", data)

                return Address.findOneAndUpdate({ userId: data.id1 }, { instructions: data.instruction })

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
exports.getAddressDetails = userId => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                return Address.find({ userId: userId }, {}, { sort: { timestamp: 1 } });
            })
            .then(addresses => {

                mongoose.disconnect();
                resolve(addresses);
            })
            .catch(err => {
                mongoose.disconnect();
                reject(err);
            });
    });
};
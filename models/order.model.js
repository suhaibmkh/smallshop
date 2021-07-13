const mongoose = require("mongoose");

const cartModel = require("./cart.model");

const DB_URL =
    "mongodb+srv://suhaib-khater_80:Galaxy-sm1@cluster0.vzcs0.mongodb.net/online-shop?retryWrites=true&w=majority";
const orderSchema = mongoose.Schema({
    name: String,
    price: Number,
    amount: Number,
    userId: String,
    productId: String,
    timestamp: Number,

    address: String,
    description: String,
    status: {
        type: String,
        default: "pending"
    },
    timestamp: Number
});
const orderListSchema = mongoose.Schema({
    orderlist: [],
    amount: Number,
    userId: String,
    timestamp: Number,

    total: String,
    status: {
        type: String,
        default: "pending"
    },
    pay: {
        type: Boolean,
        default: true
    },
    trackno: String

});

const Order = mongoose.model("order", orderSchema);
const OrderL = mongoose.model("orderl", orderListSchema);

exports.addNewOrder = data => {
    console.log("data", data)
    var key, m, m1, m2, p, d;
    var orderList1 = []
    var i = 0;
    for (key in data) {
        if (data.hasOwnProperty(key));
        i++
    }
    for (let j = 0; j < i / 2; j++) {
        m = data["test" + j]
        m1 = data["test" + j + "10"]
        m2 = data["test" + j + "5"]
        p = data["test" + j + "15"]
        d = data["test" + j + "20"]

        orderList1.push({ amount: m, id: m1, name: m2, price: p, description: d })
    }

    return new Promise((resolve, reject) => {
        cartModel
            .deleteAllItem()
            .then(() =>
                mongoose.connect(DB_URL))
            .then(() => {
                // data.timestamp = Date.now();


                var data1 = { orderlist: orderList1, userId: data.id, timestamp: Date.now(), total: data.total }

                let orderl = new OrderL(data1);
                return orderl.save();
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

exports.getOrdersByUser = userId => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                return OrderL.find({ userId: userId }, {}, { sort: { pay: -1, timestamp: 1 } });
            })
            .then(items => {

                mongoose.disconnect();
                resolve(items);
            })
            .catch(err => {
                mongoose.disconnect();
                reject(err);
            });
    });
};
exports.getOrdersById = Id => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                console.log(Id)
                return OrderL.find({ _id: Id }, {}, { sort: { pay: -1, timestamp: 1 } });
            })
            .then(items => {

                mongoose.disconnect();
                resolve(items);
            })
            .catch(err => {
                mongoose.disconnect();
                reject(err);
            });
    });
};
exports.updatePay = Id => {

    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                console.log(Id)
                return OrderL.updateOne({ _id: Id }, { pay: false });
            })
            .then(items => {


                mongoose.disconnect();
                resolve();
            })
            .catch(err => {
                mongoose.disconnect();
                reject(err);
            });
    });
}


exports.cancelOrder = id => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => OrderL.findByIdAndDelete(id))
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

exports.getAllOrders = () => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                return OrderL.find({}, {}, { sort: { pay: -1, timestamp: 1 } });
            })
            .then(items => {
                mongoose.disconnect();
                resolve(items);
            })
            .catch(err => {
                mongoose.disconnect();
                reject(err);
            });
    });
};

exports.editOrder = (id, newStatus, track) => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                return OrderL.updateOne({ _id: id }, { status: newStatus, trackno: track });
            })
            .then(items => {
                mongoose.disconnect();
                resolve(items);
            })
            .catch(err => {
                mongoose.disconnect();
                reject(err);
            });
    });
};
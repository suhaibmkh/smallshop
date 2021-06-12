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


    status: {
        type: String,
        default: "pending"
    },

});

const Order = mongoose.model("order", orderSchema);
const OrderL = mongoose.model("orderl", orderListSchema);

exports.addNewOrder = data => {

    var key, m, m1, m2;
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
        orderList1.push({ amount: m, id: m1, name: m2 })
    }

    return new Promise((resolve, reject) => {
        cartModel
            .deleteAllItem()
            .then(() =>
                mongoose.connect(DB_URL))
            .then(() => {
                // data.timestamp = Date.now();


                var data1 = { orderlist: orderList1, userId: data.id, timestamp: Date.now() }

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
                return OrderL.find({ userId: userId }, {}, { sort: { timestamp: 1 } });
            })
            .then(items => {
                console.log(items)
                mongoose.disconnect();
                resolve(items);
            })
            .catch(err => {
                mongoose.disconnect();
                reject(err);
            });
    });
};

exports.cancelOrder = id => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => Order.findByIdAndDelete(id))
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
                return Order.find({}, {}, { sort: { timestamp: 1 } });
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

exports.editOrder = (id, newStatus) => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                return Order.updateOne({ _id: id }, { status: newStatus });
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
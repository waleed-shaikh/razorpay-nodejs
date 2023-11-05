const Razorpay = require('razorpay');
const crypto = require('crypto');

const getOrderId = async(req,res)=>{
    try {
        var instance = new Razorpay({ key_id: process.env.KEY_ID, key_secret: process.env.KEY_SECRET })
        var options = {
            amount: req.body.amount * 100,
            currency: "INR",
            receipt: "TXN" + Date.now(),
            notes: {
                key1: req.body.name,
                key2: req.body.email,
                key3: req.body.number,
                key4: req.body.address,
                key5: req.body.product,
                key6: req.body.profile_name,
            }
        };

        instance.orders.create(options, function(err, order) {
            if(order){
                return res.send(order.id)
            } else {
                console.log(err);
            }
        });
    } catch (error) {
        console.log(error.message);
    }

}

const paymentCallBack = async(req,res)=>{
    const {razorpay_signature, razorpay_payment_id, razorpay_order_id} = req.body
    console.log(req.body)
    try {
        const string = `${razorpay_order_id}|${razorpay_payment_id}`;

        const generated_signature = crypto
        .createHmac('sha256', process.env.KEY_SECRET)
        .update(string)
        .digest('hex');

        if (generated_signature == razorpay_signature) {
            console.log('payment successfull')
            return res.redirect('http://localhost:3000/success')
        }
    } catch (error) {
        console.log(error.message);
    }

}

const paymentCancel = async(req,res)=>{
    try {
        return res.redirect('http://localhost:3000/failure')
    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    getOrderId,
    paymentCallBack,
    paymentCancel
}
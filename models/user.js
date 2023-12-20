const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    password: { type: String, required: true, min: 6, max: 64 },
    picture: { type: String, default: "https://picsum.photos/seed/picsum/200/300" },
    role: { type: [String], default: ["Subscriber"], enum: ["Subscriber", "Instructor", "Admin"] },
    Stripe_account_id: String,  // Corrected this line
    Stripe_Seller: {},          // Corrected this line
    StripeSession: {}           // Corrected this line
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);


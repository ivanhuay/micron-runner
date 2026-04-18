import mongoose from 'mongoose';

const transactionReportSchema = new mongoose.Schema({
    group: {
        type: String,
        enum: ['park', 'recharge', 'card-initialize', 'credit-charge'],
        required: true
    },
    subgroup: {
        type: String,
        enum: ['app', 'totem', 'comercio', 'sucursal']
    },
    date: Date,
    data: String,
    amount: Number,
    quantity: Number,
    total: { type: Boolean, default: false },
    reference: {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        park: { type: String, ref: 'Park' },
        otherUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }
    },
    processed: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('TransactionReport', transactionReportSchema);

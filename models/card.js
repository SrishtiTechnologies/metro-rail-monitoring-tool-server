import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    cardNumber: { type: Number, unique: true, required: true },
    cardType: { type: String, required: true },
    amount: { type: Number, required: true },
    customerId: { type: Number, required: true },
    creationDate: { type: Date, default: Date.now() }
});

export default mongoose.model("Card", cardSchema);
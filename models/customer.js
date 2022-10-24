import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    customerId: { type: Number, unique: true, required: true },
    name: { type: String, required: true },
    emailId: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    creationDate: { type: Date, default: Date.now() }
});

export default mongoose.model("Customer", customerSchema);
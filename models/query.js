import mongoose from 'mongoose';

const querySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    queryNumber: { type: Number, unique: true, required: true },
    customerName: { type: String, required: true },
    contactType: { type: String, required: true },
    emailId: { type: String },
    phone: { type: Number },
    status: { type: String, required: true },
    creationDate: { type: Date, default: Date.now() }
});

export default mongoose.model("Query", querySchema);
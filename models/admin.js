import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    adminId: { type: Number, unique: true, required: true },
    name: { type: String, required: true },
    emailId: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    dob: { type: Date, required: true },
    address: { type: String, required: true },
    creationDate: { type: Date, default: Date.now() }
});

export default mongoose.model("Admin", adminSchema);
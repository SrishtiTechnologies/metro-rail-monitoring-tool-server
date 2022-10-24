import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    employeeId: { type: Number, unique: true, required: true },
    creationDate: { type: Date, default: Date.now() }
});

export default mongoose.model("Employee", employeeSchema);
import mongoose from 'mongoose';

const trainSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    trainId: { type: Number, unique: true, required: true },
    no_of_coaches: { type: Number, required: true },
    routeId: { type: Number, required: true }
});

export default mongoose.model("Train", trainSchema);
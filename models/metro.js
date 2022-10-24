import mongoose from 'mongoose';

const metroSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    metroId: { type: Number, unique: true, required: true },
    no_of_coaches: { type: Number, required: true },
    routeId: { type: Number, required: true }
});

export default mongoose.model("Metro", metroSchema);
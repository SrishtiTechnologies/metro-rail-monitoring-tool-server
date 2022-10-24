import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    stationId: { type: Number, unique: true, required: true },
    name: { type: String, required: true },
    routeId: { type: Number, required: true }
});

export default mongoose.model("Station", stationSchema);
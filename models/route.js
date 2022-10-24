import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    routeId: { type: Number, unique: true, required: true },
    no_of_stations: { type: Number, required: true }
});

export default mongoose.model("Route", routeSchema);
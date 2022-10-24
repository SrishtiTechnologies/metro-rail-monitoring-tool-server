import express from 'express';
import mongoose from 'mongoose';
import Station from '../models/station.js';

const router = express.Router();

router.get('/', (req, res) => {
    Station.find((err, docs) => {
        if (!err) {
            let count = docs.length;
            let message;
            if (count > 0) {
                if (count == 1) {
                    message = count + " station was found.";
                }
                else {
                    message = count + " stations were found.";
                }
                res.status(200).json({
                    message: message,
                    station_details: docs.map(doc => {
                        return {
                            stationId: doc.stationId,
                            name: doc.name,
                            routeId: doc.routeId
                        }
                    })
                });
            }
            else {
                res.status(201).json({
                    message: "No stations were found",
                    error: "No stations are created."
                });
            }
        }
        else {
            console.log(err);
            res.status(500).json({
                message: "Stations could not be found",
                error: err.message
            });
        }
    });
});

router.get('/:stationId', (req, res) => {
    let stationId = req.params.stationId;

    Station.findOne({ stationId: stationId }, (err, doc) => {
        if (!err) {
            if (doc != null) {
                res.status(200).json({
                    message: "Found station details successfully.",
                    station_details: {
                        stationId: doc.stationId,
                        name: doc.name,
                        routeId: doc.routeId
                    }
                });
            }
            else {
                res.status(201).json({
                    messsage: "Station details could not be found",
                    error: "Station is not created."
                });
            }
        }
        else {
            console.log(err);
            res.status(500).json({
                messsage: "Station details could not be found",
                error: err.message
            });
        }
    });
});

router.post('/', (req, res) => {
    let stationId;

    Station.findOne().sort({ _id: -1 }).exec().then(doc => {
        if (!doc) {
            stationId = 5001;
        }
        else {
            stationId = doc.stationId + 1;
        }

        let station = new Station({
            _id: new mongoose.Types.ObjectId(),
            stationId: stationId,
            name: req.body.name,
            routeId: req.body.routeId
        });

        station.save().then(doc => {
            res.status(200).json({
                message: "Station created successfully.",
                station_details: {
                    stationId: doc.stationId,
                    name: doc.name,
                    routeId: doc.routeId
                }
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Station could not be created",
                error: err.message
            });
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: "Station could not be created",
            error: err.message
        });
    });
});

router.put('/:stationId', (req, res) => {
    let stationId = req.params.stationId;

    const new_details = {
        name: req.body.name,
        routeId: req.body.routeId
    }

    Station.findOneAndUpdate({ stationId: stationId }, new_details).exec().then(doc => {
        res.status(200).json({
            message: "Updated station details successfully.",
            station_details: {
                stationId: doc.stationId,
                name: new_details.name,
                routeId: new_details.routeId
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: "Station details could not be updated",
            error: err.message
        });
    });
});

export default router;
import express from 'express';
import mongoose from 'mongoose';
import Route from '../models/route.js';

const router = express.Router();

router.get('/', (req, res) => {
    Route.find((err, docs) => {
        if (!err) {
            let count = docs.length;
            let message;
            if (count > 0) {
                if (count == 1) {
                    message = count + " route was found.";
                }
                else {
                    message = count + " routes were found.";
                }
                res.status(200).json({
                    message: message,
                    route_details: docs.map(doc => {
                        return {
                            routeId: doc.routeId,
                            no_of_stations: doc.no_of_stations
                        }
                    })
                });
            }
            else {
                res.status(201).json({
                    message: "No routes were found",
                    error: "No routes are created."
                });
            }
        }
        else {
            console.log(err);
            res.status(500).json({
                message: "Routes could not be found",
                error: err.message
            });
        }
    });
});

router.get('/:routeId', (req, res) => {
    let routeId = req.params.routeId;

    Route.findOne({ routeId: routeId }, (err, doc) => {
        if (!err) {
            if (doc != null) {
                res.status(200).json({
                    message: "Found route details successfully.",
                    route_details: {
                        routeId: doc.routeId,
                        no_of_stations: doc.no_of_stations
                    }
                });
            }
            else {
                res.status(201).json({
                    messsage: "Route details could not be found",
                    error: "Route is not created."
                });
            }
        }
        else {
            console.log(err);
            res.status(500).json({
                message: "Route details could not be found",
                error: err.message
            });
        }
    });
});

router.post('/', (req, res) => {
    let routeId;

    Route.findOne().sort({ _id: -1 }).exec().then(doc => {
        if (!doc) {
            routeId = 101;
        }
        else {
            routeId = doc.routeId + 1;
        }

        let route = new Route({
            _id: new mongoose.Types.ObjectId(),
            routeId: routeId,
            no_of_stations: req.body.no_of_stations
        });

        route.save().then(doc => {
            res.status(200).json({
                message: "Route created successfully.",
                route_details: {
                    routeId: doc.routeId,
                    no_of_stations: doc.no_of_stations
                }
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Route could not be created",
                error: err.message
            });
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: "Route could not be created",
            error: err.message
        });
    });
});

router.put('/:routeId', (req, res) => {
    let routeId = req.params.routeId;
    let no_of_stations = req.body.no_of_stations

    Route.findOneAndUpdate({ routeId: routeId }, { no_of_stations: no_of_stations }).exec().then(doc => {
        res.status(200).json({
            message: "Updated route details successfully.",
            route_details: {
                routeId: doc.routeId,
                no_of_stations: no_of_stations
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: "Route details could not be updated",
            error: err.message
        });
    });
});

export default router;
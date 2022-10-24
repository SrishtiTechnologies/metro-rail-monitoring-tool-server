import express from 'express';
import mongoose from 'mongoose';
import Metro from '../models/metro';

const router = express.Router();

router.get('/', (req, res) => {
    Metro.find((err, docs) => {
        if (!err) {
            let count = docs.length;
            let message;
            if (count > 0) {
                if (count == 1) {
                    message = count + " metro was found.";
                }
                else {
                    message = count + " metros were found.";
                }
                res.status(200).json({
                    message: message,
                    metro_details: docs.map(doc => {
                        return {
                            metroId: doc.metroId,
                            no_of_coaches: doc.no_of_coaches,
                            routeId: doc.routeId
                        }
                    })
                });
            }
            else {
                res.status(201).json({
                    message: "No metros were found",
                    error: "No metros are created."
                });
            }
        }
        else {
            console.log(err);
            res.status(500).json({
                message: "Metros could not be found",
                error: err.message
            });
        }
    });
});

router.get('/:metroId', (req, res) => {
    let metroId = req.params.metroId;

    Metro.findOne({ metroId: metroId }, (err, doc) => {
        if (!err) {
            if (doc != null) {
                res.status(200).json({
                    message: "Found metro details successfully.",
                    metro_details: {
                        metroId: doc.metroId,
                        no_of_coaches: doc.no_of_coaches,
                        routeId: doc.routeId
                    }
                });
            }
            else {
                res.status(201).json({
                    messsage: "Metro details could not be found",
                    error: "Metro is not created."
                });
            }
        }
        else {
            console.log(err);
            res.status(500).json({
                message: "Metro details could not be found",
                error: err.message
            });
        }
    });
});

router.post('/', (req, res) => {
    let metroId;

    Metro.findOne().sort({ _id: -1 }).exec().then(doc => {
        if (!doc) {
            metroId = 301;
        }
        else {
            metroId = doc.metroId + 1;
        }

        let metro = new Metro({
            _id: new mongoose.Types.ObjectId(),
            metroId: metroId,
            no_of_coaches: req.body.no_of_coaches,
            routeId: req.body.routeId
        });

        metro.save().then(doc => {
            res.status(200).json({
                message: "Metro created successfully.",
                metroId: doc.metroId
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Metro could not be created",
                error: err.message
            });
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: "Metro could not be created",
            error: err.message
        });
    });
});

router.put('/:metroId', (req, res) => {
    let metroId = req.params.metroId;

    const new_details = {
        no_of_coaches: req.body.no_of_coaches,
        routeId: req.body.routeId
    }

    Metro.findOneAndUpdate({ metroId: metroId }, new_details).exec().then(doc => {
        res.status(200).json({
            message: "Updated metro details successfully.",
            metro_details: {
                metroId: doc.metroId,
                name: new_details.no_of_coaches,
                routeId: new_details.routeId
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: "Metro details could not be updated",
            error: err.message
        });
    });
});

export default router;
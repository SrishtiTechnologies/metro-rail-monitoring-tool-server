import express from 'express';
import mongoose from 'mongoose';
import Train from '../models/train.js';

const router = express.Router();

router.get('/', (req, res) => {
    Train.find((err, docs) => {
        if (!err) {
            let count = docs.length;
            let message;
            if (count > 0) {
                if (count == 1) {
                    message = count + " train was found.";
                }
                else {
                    message = count + " trains were found.";
                }
                res.status(200).json({
                    message: message,
                    train_details: docs.map(doc => {
                        return {
                            trainId: doc.trainId,
                            no_of_coaches: doc.no_of_coaches,
                            routeId: doc.routeId
                        }
                    })
                });
            }
            else {
                res.status(201).json({
                    message: "No trains were found",
                    error: "No trains are created."
                });
            }
        }
        else {
            console.log(err);
            res.status(500).json({
                message: "Trains could not be found",
                error: err.message
            });
        }
    });
});

router.get('/:trainId', (req, res) => {
    let trainId = req.params.trainId;

    Train.findOne({ trainId: trainId }, (err, doc) => {
        if (!err) {
            if (doc != null) {
                res.status(200).json({
                    message: "Found train details successfully.",
                    train_details: {
                        trainId: doc.trainId,
                        no_of_coaches: doc.no_of_coaches,
                        routeId: doc.routeId
                    }
                });
            }
            else {
                res.status(201).json({
                    messsage: "Train details could not be found",
                    error: "Train is not created."
                });
            }
        }
        else {
            console.log(err);
            res.status(500).json({
                message: "Train details could not be found",
                error: err.message
            });
        }
    });
});

router.post('/', (req, res) => {
    let trainId;

    Train.findOne().sort({ _id: -1 }).exec().then(doc => {
        if (!doc) {
            trainId = 301;
        }
        else {
            trainId = doc.trainId + 1;
        }

        let train = new Train({
            _id: new mongoose.Types.ObjectId(),
            trainId: trainId,
            no_of_coaches: req.body.no_of_coaches,
            routeId: req.body.routeId
        });

        train.save().then(doc => {
            res.status(200).json({
                message: "Train created successfully.",
                trainId: doc.trainId
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Train could not be created",
                error: err.message
            });
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: "Train could not be created",
            error: err.message
        });
    });
});

router.put('/:trainId', (req, res) => {
    let trainId = req.params.trainId;

    const new_details = {
        no_of_coaches: req.body.no_of_coaches,
        routeId: req.body.routeId
    }

    Train.findOneAndUpdate({ trainId: trainId }, new_details).exec().then(doc => {
        res.status(200).json({
            message: "Updated train details successfully.",
            train_details: {
                trainId: doc.trainId,
                name: new_details.no_of_coaches,
                routeId: new_details.routeId
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: "Train details could not be updated",
            error: err.message
        });
    });
});

export default router;
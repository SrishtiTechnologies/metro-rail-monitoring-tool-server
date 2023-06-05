import express from 'express';
import mongoose from 'mongoose';
import Query from '../models/query.js';

const router = express.Router();

router.get('/', (req, res) => {
    Query.find((err, docs) => {
        if (!err) {
            let count = docs.length;
            let message;
            if (count > 0) {
                if (count == 1) {
                    message = count + " query was found.";
                }
                else {
                    message = count + " queries were found.";
                }
                res.status(200).json({
                    message: message,
                    query_details: docs.map(doc => {
                        return {
                            queryNumber: doc.queryNumber,
                            customerName: doc.customerName,
                            contactType: doc.contactType,
                            emailId: doc.emailId,
                            phone: doc.phone,
                            status: doc.status,
                            queryDescription: doc.queryDescription
                        }
                    })
                });
            }
            else {
                res.status(201).json({
                    message: "No queries were found",
                    error: "No queries are submitted."
                });
            }
        }
        else {
            console.log(err);
            res.status(500).json({
                message: "Queries could not be found",
                error: err.message
            });
        }
    });
});

router.get(':queryNumber', (req, res) => {
    let queryNumber = req.params.queryNumber;

    Query.findOne({ queryNumber: queryNumber }, (err, doc) => {
        if (!err) {
            if (doc != null) {
                res.status(200).json({
                    message: "Found query details successfully.",
                    query_details: {
                        queryNumber: doc.queryNumber,
                        customerName: doc.customerName,
                        contactType: doc.contactType,
                        emailId: doc.emailId,
                        phone: doc.phone,
                        status: doc.status,
                        queryDescription: doc.queryDescription
                    }
                });
            }
            else {
                res.status(201).json({
                    messsage: "Query details could not be found",
                    error: "Query is not submitted."
                });
            }
        }
        else {
            console.log(err);
            res.status(500).json({
                message: "Query details could not be found",
                error: err.message
            });
        }
    });
});

router.post('/', (req, res) => {
    let queryNumber;

    Query.findOne().sort({ _id: -1 }).exec().then(doc => {
        console.log(doc);
        if (!doc) {
            queryNumber = 10000001;
        }
        else {
            queryNumber = doc.queryNumber + 1;
        }

        let query = new Query({
            _id: new mongoose.Types.ObjectId(),
            queryNumber: queryNumber,
            customerName: req.body.customerName,
            contactType: req.body.contactType,
            emailId: req.body.emailId,
            phone: req.body.phone,
            status: "New",
            queryDescription: req.body.query
        });

        query.save().then(doc => {
            res.status(200).json({
                message: "New Query saved successfully.",
                queryNumber: doc.queryNumber
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                message: "New Query could not be saved",
                error: err.message
            });
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: "New Query could not be saved",
            error: err.message
        });
    });
});

router.put('/:queryNumber', (req, res) => {
    let queryNumber = req.params.queryNumber;
    let status = req.body.status;

    Query.findOneAndUpdate({ queryNumber: queryNumber }, { status: status }).exec().then(doc => {
        res.status(200).json({
            message: "Updated Query status successfully.",
            query_details: {
                queryNumber: doc.queryNumber,
                status: status
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: "Query status could not be updated",
            error: err.message
        });
    });
})

export default router;
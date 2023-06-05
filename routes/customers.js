import express from 'express';
import mongoose from 'mongoose';
import Customer from '../models/customer.js';

const router = express.Router();

router.get('/', (req, res) => {
    Customer.find((err, docs) => {
        if (!err) {
            let count = docs.length;
            let message;
            if (count > 0) {
                if (count == 1) {
                    message = count + " customer was found.";
                }
                else {
                    message = count + " customers were found.";
                }
                res.status(200).json({
                    message: message,
                    customer_details: docs.map(doc => {
                        return {
                            customerId: doc.customerId,
                            name: doc.name,
                            emailId: doc.emailId,
                            password: doc.password,
                            phone: doc.phone
                        }
                    })
                });
            }
            else {
                res.status(201).json({
                    message: "No customers were found",
                    error: "No customers are registered."
                });
            }
        }
        else {
            console.log(err);
            res.status(500).json({
                message: "Customers could not be found",
                error: err.message
            });
        }
    });
});

router.get('/:customerId', (req, res) => {
    let customerId = req.params.customerId;

    Customer.findOne({ customerId: customerId }, (err, doc) => {
        if (!err) {
            if (doc != null) {
                res.status(200).json({
                    message: "Found customer details successfully.",
                    customer_details: {
                        customerId: doc.customerId,
                        name: doc.name,
                        emailId: doc.emailId,
                        password: doc.password,
                        phone: doc.phone
                    }
                });
            }
            else {
                res.status(201).json({
                    message: "Customer details could not be found",
                    error: "Customer is not registered."
                });
            }
        }
        else {
            console.log(err);
            res.status(500).json({
                message: "Customer details could not be found",
                error: err.message
            });
        }
    });
});

router.post('/', (req, res) => {
    let customerId;
    let emailId = req.body.emailId;

    Customer.findOne({ emailId: emailId }, (err, doc) => {
        if (!err) {
            if (!doc) {
                Customer.findOne().sort({ _id: -1 }).exec().then(doc => {
                    if (!doc) {
                        customerId = 10001;
                    }
                    else {
                        customerId = doc.customerId + 1;
                    }

                    let customer = new Customer({
                        _id: new mongoose.Types.ObjectId(),
                        customerId: customerId,
                        name: req.body.name,
                        emailId: emailId,
                        password: req.body.password,
                        phone: req.body.phone
                    });

                    customer.save().then(doc => {
                        res.status(200).json({
                            message: "Customer created successfully.",
                            customerId: doc.customerId
                        });
                    }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                            message: "Customer could not be created",
                            error: err.message
                        });
                    });
                }).catch(err => {
                    console.log(err);
                    res.status(500).json({
                        message: "Customer could not be created",
                        error: err.message
                    });
                });
            }
            else {
                res.status(202).json({
                    message: "Customer could not be created",
                    error: "Customer is already registered with this email."
                });
            }
        }
        else {
            console.log(err);
            res.status(500).json({
                message: "Customer could not be created",
                error: err.message
            });
        }
    });
});

router.put('/:customerId', (req, res) => {
    let customerId = req.params.customerId;
    let new_details = req.body;

    Customer.findOneAndUpdate({ customerId: customerId }, new_details, { new: true, useFindAndModify: true }).exec().then(doc => {
        res.status(200).json({
            message: "Updated customer details successfully."
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: "Customer details could not be updated",
            error: err.message
        });
    });
});

router.delete('/:customerId', (req, res) => {
    let customerId = req.params.customerId;

    Customer.findOneAndDelete({ customerId: customerId }).exec().then(doc => {
        res.status(200).json({
            message: "Deleted customer successfully.",
            customerId: doc.customerId,
            name: doc.name
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: "Customer could not be deleted",
            error: err.message
        });
    })
});

export default router;
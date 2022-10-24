import express from 'express';
import mongoose from 'mongoose';
import Customer from '../models/customer.js';
import Card from '../models/card.js';

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

router.get('/:id', (req, res) => {
    let id = req.params.id;
    let searchObject = {};

    if (!isNaN(id)) {
        searchObject = {
            customerId: id
        }
    }
    else {
        searchObject = {
            emailId: id
        }
    }

    Customer.findOne(searchObject, (err, doc) => {
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

router.get('/cards/:customerId', (req, res) => {
    let customerId = req.params.customerId;
    Card.find({ customerId: customerId }, (err, docs) => {
        if (!err) {
            let count = docs.length;
            let message;
            if (count > 0) {
                if (count == 1) {
                    message = count + " card was found.";
                }
                else {
                    message = count + " cards were found.";
                }
                res.status(200).json({
                    message: message,
                    cards: docs.map(doc => {
                        return {
                            cardNumber: doc.cardNumber,
                            cardType: doc.cardType,
                            amount: doc.amount,
                        }
                    })
                });
            }
            else {
                res.status(201).json({
                    message: "No cards were found.",
                    error: "No cards are registered for this customer"
                });
            }
        }
        else {
            console.log(err);
            res.status(500).json({
                message: "Cards could not be found",
                error: err.message
            });
        }
    });
});

router.post('/', (req, res) => {
    let customer_Id;
    let emailId = req.body.emailId;

    Customer.findOne({ emailId: emailId }, (err, doc) => {
        if (!err) {
            if (!doc) {
                Customer.findOne().sort({ _id: -1 }).exec().then(doc => {
                    if (!doc) {
                        customer_Id = 10001;
                    }
                    else {
                        customer_Id = doc.customerId + 1;
                    }

                    let customer = new Customer({
                        _id: new mongoose.Types.ObjectId(),
                        customerId: customer_Id,
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

router.put('/:id', (req, res) => {
    let id = req.params.id;
    let searchObject = {};

    if (!isNaN(id)) {
        searchObject = {
            customerId: id
        }
    }
    else {
        searchObject = {
            emailId: id
        }
    }

    let new_details = req.body;

    Customer.findOneAndUpdate(searchObject, new_details, { new: true, useFindAndModify: true }).exec().then(doc => {
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

router.delete('/:custId', (req, res) => {
    let custId = req.params.custId;

    Customer.findOneAndDelete({ customerId: custId }).exec().then(doc => {
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
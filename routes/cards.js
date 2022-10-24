import express from 'express';
import mongoose from 'mongoose';
import Card from '../models/card.js';

const router = express.Router();

router.get('/', (req, res) => {
    Card.find((err, docs) => {
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
                    card_details: docs.map(doc => {
                        return {
                            cardNumber: doc.cardNumber,
                            cardType: doc.cardType,
                            amount: doc.amount,
                            customerId: doc.customerId
                        }
                    })
                });
            }
            else {
                res.status(201).json({
                    message: "No cards were found",
                    error: "No card are registered."
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

router.get('/:cardNumber', (req, res) => {
    let cardNumber = req.params.cardNumber;

    Card.findOne({ cardNumber: cardNumber }, (err, doc) => {
        if (!err) {
            if (doc != null) {
                res.status(200).json({
                    message: "Found card details successfully.",
                    card_details: {
                        cardNumber: doc.cardNumber,
                        cardType: doc.cardType,
                        amount: doc.amount,
                        customerId: doc.customerId
                    }
                });
            }
            else {
                res.status(201).json({
                    messsage: "Card details could not be found",
                    error: "Card is not registered."
                });
            }
        }
        else {
            console.log(err);
            res.status(500).json({
                message: "Card details could not be found",
                error: err.message
            });
        }
    });
});

router.post('/', (req, res) => {
    let cardNumber;

    Card.findOne().sort({ _id: -1 }).exec().then(doc => {
        console.log(doc);
        if (!doc) {
            cardNumber = 100001;
        }
        else {
            cardNumber = doc.cardNumber + 1;
        }

        let card = new Card({
            _id: new mongoose.Types.ObjectId(),
            cardNumber: cardNumber,
            cardType: req.body.cardType,
            amount: req.body.amount,
            customerId: req.body.customerId
        });

        card.save().then(doc => {
            res.status(200).json({
                message: "New Card created successfully.",
                cardNumber: doc.cardNumber
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                message: "New Card could not be created",
                error: err.message
            });
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: "New Card could not be created",
            error: err.message
        });
    });
});

router.put('/:cardNumber', (req, res) => {
    let cardNumber = req.params.cardNumber;

    const new_details = {
        cardType: req.body.cardType,
        amount: req.body.amount,
    }

    Card.findOneAndUpdate({ cardNumber: cardNumber }, new_details).exec().then(doc => {
        res.status(200).json({
            message: "Updated card details successfully.",
            card_details: {
                cardNumber: doc.cardNumber,
                cardType: new_details.cardType,
                amount: new_details.amount,
                customerId: doc.customerId
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: "Card details could not be updated",
            error: err.message
        });
    });
})

router.delete('/:cardNumber', (req, res) => {
    let cardNumber = req.params.cardNumber;

    Card.findOneAndDelete({ cardNumber: cardNumber }).exec().then(doc => {
        res.status(200).json({
            message: "Deleted card successfully.",
            deleted_card: {
                cardNumber: doc.cardNumber,
                customerId: doc.customerId
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: "Card could not be deleted",
            error: err.message
        });
    });
});

export default router;
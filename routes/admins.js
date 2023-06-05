import express from 'express';
import mongoose from 'mongoose';
import Admin from '../models/admin.js';

const router = express.Router();

router.get('/', (req, res) => {
    Admin.find((err, docs) => {
        if (!err) {
            let count = docs.length;
            let message;
            if (count > 0) {
                if (count == 1) {
                    message = count + " admin was found.";
                }
                else {
                    message = count + " admins were found.";
                }
                res.status(200).json({
                    message: message,
                    admin_details: docs.map(doc => {
                        return {
                            adminId: doc.adminId,
                            name: doc.name,
                            emailId: doc.emailId,
                            password: doc.password,
                            phone: doc.phone,
                            dob: doc.dob,
                            address: doc.address
                        }
                    })
                });
            }
            else {
                res.status(201).json({
                    message: "No admins were found",
                    error: "No admins are registered."
                });
            }
        }
        else {
            console.log(err);
            res.status(500).json({
                message: "Admins could not be found",
                error: err.message
            });
        }
    });
});

router.get('/:adminId', (req, res) => {
    let adminId = req.params.adminId;

    Admin.findOne({ adminId: adminId }, (err, doc) => {
        if (!err) {
            if (doc != null) {
                res.status(200).json({
                    message: "Found admin details successfully.",
                    admin_details: {
                        adminId: doc.adminId,
                        name: doc.name,
                        emailId: doc.emailId,
                        password: doc.password,
                        phone: doc.phone,
                        dob: doc.dob,
                        address: doc.address
                    }
                });
            }
            else {
                res.status(201).json({
                    message: "Admin details could not be found",
                    error: "Admin is not registered"
                });
            }
        }
        else {
            console.log(err);
            res.status(500).json({
                message: "Admin details could not be found",
                error: err.message
            });
        }
    });
});

router.post('/', (req, res) => {
    let adminId;
    let emailId = req.body.emailId;

    Admin.findOne({ emailId: emailId }, (err, doc) => {
        if (!err) {
            if (!doc) {
                Admin.findOne().sort({ _id: -1 }).exec().then(doc => {
                    if (!doc) {
                        adminId = 2001;
                    }
                    else {
                        adminId = doc.adminId + 1;
                    }

                    let admin = new Admin({
                        _id: new mongoose.Types.ObjectId(),
                        adminId: adminId,
                        name: req.body.name,
                        emailId: emailId,
                        password: req.body.password,
                        phone: req.body.phone,
                        dob: req.body.dob,
                        address: req.body.address
                    });

                    admin.save().then(doc => {
                        res.status(200).json({
                            message: "Admin created successfully.",
                            adminId: doc.adminId
                        });
                    }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                            message: "Admin could not be created",
                            error: err.message
                        });
                    });
                }).catch(err => {
                    console.log(err);
                    res.status(500).json({
                        message: "Admin could not be created",
                        error: err.message
                    });
                });
            }
            else {
                res.status(201).json({
                    message: "Admin could not be created",
                    error: "Admin is already registered with this adminId"
                });
            }
        }
        else {
            console.log(err);
            res.status(500).json({
                message: "Admin could not be created",
                error: err.message
            });
        }
    });
});

router.put('/:adminId', (req, res) => {
    let adminId = req.params.adminId;

    const new_details = {
        name: req.body.name,
        emailId: req.body.emailId,
        password: req.body.password,
        phone: req.body.phone,
        dob: req.body.dob,
        address: req.body.address
    }

    Admin.findOneAndUpdate({ adminId: adminId }, new_details).exec().then(doc => {
        res.status(200).json({
            message: "Updated admin details successfully.",
            admin_details: {
                adminId: doc.adminId,
                name: new_details.name,
                emailId: new_details.emailId,
                password: new_details.password,
                phone: new_details.phone,
                dob: new_details.dob,
                address: new_details.address
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: "Admin details could not be updated",
            error: err.message
        });
    });
});

router.delete('/:adminId', (req, res) => {
    let adminId = req.params.adminId;

    Admin.findOneAndDelete({ adminId: adminId }).exec().then(doc => {
        res.status(200).json({
            message: "Deleted admin successfully",
            deleted_admin: {
                adminId: doc.adminId,
                name: doc.name
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: "Admin could not be deleted",
            error: err.message
        });
    });
});

export default router;
import express from 'express';
import mongoose from 'mongoose';
import mongoose from 'mongoose';
import Employee  from '../models/employee';

const router = express.Router();

router.get('/', (req, res) => {
    Employee.find((err, docs) => {
        if (!err) {
            let count = docs.length;
            let message;
            if (count > 0) {
                if (count == 1) {
                    message = count + " employee was found.";
                }
                else {
                    message = count + " employees were found.";
                }
                res.status(200).json({
                    message: message,
                    employee_details: docs.map(doc => {
                        return {
                            employeeId: doc.employeeId
                        }
                    })
                });
            }
            else {
                res.status(201).json({
                    message: "No employees were found",
                    error: "No employee ids are saved."
                });
            }
        }
        else {
            console.log(err);
            res.status(500).json({
                message: "Employees could not be found",
                error: err.message
            });
        }
    });
});

router.get('/:id', (req, res) => {
    let id = req.params.id;

    Employee.findOne({ employeeId: id }, (err, doc) => {
        if (!err) {
            if (doc != null) {
                res.status(200).json({
                    message: "Found employee details successfully.",
                    employee_details: {
                        employeeId: doc.employeeId
                    }
                });
            }
            else {
                res.status(201).json({
                    message: "Employee details could not be found",
                    error: "No employee found for the employee Id."
                });
            }
        }
        else {
            console.log(err);
            res.status(500).json({
                message: "Employee details could not be found",
                error: err.message
            });
        }
    });
});

router.post('/', (req, res) => {
    let employeeId = req.body.employeeId;

    Employee.findOne({ employeeId: employeeId }, (err, doc) => {
        if (!err) {
            if (!doc) {
                let employee = new Employee({
                    _id: new mongoose.Types.ObjectId(),
                    employeeId: employeeId
                });

                employee.save().then(doc => {
                    res.status(200).json({
                        message: "Employee id saved successfully.",
                        employeeId: doc.employeeId
                    });
                }).catch(err => {
                    console.log(err);
                    res.status(500).json({
                        message: "Employee id could not be saved",
                        error: err.message
                    });
                });
            }
            else {
                res.status(201).json({
                    message: "Employee id could not be saved",
                    error: "Employee id is already present."
                });
            }
        }
        else {
            console.log(err);
            res.status(500).json({
                message: "Employee id could not be saved",
                error: err.message
            });
        }
    });
});

router.delete('/:employeeId', (req, res) => {
    let employeeId = req.params.employeeId;

    Employee.findOneAndDelete({ employeeId: employeeId }).exec().then(doc => {
        res.status(200).json({
            message: "Deleted employee id successfully.",
            deleted_employeeId: doc.employeeId
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: "Employee id could not be deleted",
            error: err.message
        });
    });
});

export default router;
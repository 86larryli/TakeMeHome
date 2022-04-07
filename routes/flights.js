const mongoose = require("mongoose");
const Schedule = mongoose.model('Schedule');

const express = require('express');
const router = express.Router();

router.get('/getFlightSchedules', (req, res) => {
    const sortField = req.query.sortField;
    const sortOrder = req.query.sortOrder === "ascend" ? 1 : -1;
    let filters = req.query.filters;
    const page = req.query.page;
    const pageSize = req.query.pageSize || 10;
    let sortBy = {};
    let findFilter = {};

    if (sortField) {
        sortBy[sortField] = sortOrder;
    }

    if (filters) {
        filters = JSON.parse(filters);
        for (field in filters) {
            findFilter[field] = {};
            findFilter[field]["$in"] = filters[field];
        }
    }

    Schedule
        .find(findFilter)
        .sort(sortBy)
        .skip((page - 1) * pageSize)
        .limit(pageSize || 10)
        .exec((err, findResult) => {
            if (err) {
                console.log("[ERROR] Error occurred when finding Schedule");
                res.status(500).send("500 Internal Server Error");
            } else {
                res.send(findResult);
            }
        });
});

module.exports = router;

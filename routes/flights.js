const mongoose = require("mongoose");
const Schedule = mongoose.model('Schedule');

const express = require('express');
const router = express.Router();

router.get('/getFlightSchedules', async (req, res) => {
    const sortField = req.query.sortField;
    const sortOrder = req.query.sortOrder === "ascend" ? 1 : -1;
    let filters = req.query.filters;
    const page = req.query.page || 1;
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

    const totalCount = await Schedule.countDocuments(findFilter);
    let distinctDepCity = await Schedule.find().distinct('depcity');
    let distinctArrCity = await Schedule.find().distinct('arrcity');
    let distinctAirline = await Schedule.find().distinct('airline');

    Schedule
        .find(findFilter)
        .sort(sortBy)
        .skip((page - 1) * pageSize)
        .limit(pageSize || 10)
        .exec((err, findResult) => {
            if (err) {
                console.log("[ERROR] Error occurred when finding Schedule\n", err);
                res.status(500).send("500 Internal Server Error");
            } else {
                distinctDepCity = distinctDepCity.map(ele => {
                    return {
                        text: ele,
                        value: ele
                    }
                });

                distinctArrCity = distinctArrCity.map(ele => {
                    return {
                        text: ele,
                        value: ele
                    }
                });

                distinctAirline = distinctAirline.map(ele => {
                    return {
                        text: ele,
                        value: ele
                    }
                });

                res.json({
                    totalCount, rows: findResult, columnFilters: {
                        depcity: distinctDepCity,
                        arrcity: distinctArrCity,
                        airline: distinctAirline
                    }
                });
            }
        });
});

module.exports = router;

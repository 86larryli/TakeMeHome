const mongoose = require("mongoose");
const Schedule = mongoose.model('Schedule');

const date = require('date-and-time');
const express = require('express');
const router = express.Router();

const testingRequirementMap = {
    "MU588": {
        "Inactivated": {
            "Self-Monitoring": {
                dayOffSet: [-7, -1]
            },
            "PCR 1": {
                dayOffSet: [-7],
                time: "Any Time"
            },
            "PCR 2": {
                dayOffSet: [-2, -1],
                time: "Any Time"
            },
            "PCR 3": {
                dayOffSet: [-1],
                time: "Any Time",
                note: "Must be taken at a different agency from the second one."
            },
            "Antigen 1": {
                dayOffSet: [0],
                time: "Same Day at Terminal Before Departure"
            },
        }
    },
    "CA770": {
        "Inactivated": {
            "Self-Monitoring": {
                dayOffSet: [-7, -1]
            },
            "PCR 1": {
                dayOffSet: [-7],
                time: "Any Time"
            },
            "PCR 2": {
                dayOffSet: [-2, -1, 0],
                time: "Any Time"
            },
            "PCR 3": {
                dayOffSet: [-1, 0],
                time: "Any Time",
                note: "Must be taken at a different agency from the second one."
            },
            "Antigen 1": {
                dayOffSet: [0],
                time: "Same Day Before Departure"
            },
        }
    },
    "CA988": {
        "Inactivated": {
            "Self-Monitoring": {
                dayOffSet: [-7, -1]
            },
            "PCR 1": {
                dayOffSet: [-7],
                time: "Any Time"
            },
            "PCR 2": {
                dayOffSet: [-2, -1, 0],
                time: "Any Time"
            },
            "PCR 3": {
                dayOffSet: [-1, 0],
                time: "Any Time",
                note: "Must be taken at a different agency from the second one."
            },
            "Antigen 1": {
                dayOffSet: [0],
                time: "Same Day Before Departure"
            },
        }
    },
    "CZ328": {
        "Inactivated": {
            "Self-Monitoring": {
                dayOffSet: [-7, -1]
            },
            "PCR 1": {
                dayOffSet: [-7],
                time: "Any Time"
            },
            "PCR 2": {
                dayOffSet: [-2, -1, 0],
                time: "Any Time"
            },
            "PCR 3": {
                dayOffSet: [-1, 0],
                time: "Any Time",
                note: "Must be taken at a different agency from the second one."
            },
            "Antigen 1": {
                dayOffSet: [0],
                time: "After 12:00 at Noon - Same Day Before Departure"
            },
        }
    },
    "MF830": {
        "Inactivated": {
            "Self-Monitoring": {
                dayOffSet: [-7, -1]
            },
            "PCR 1": {
                dayOffSet: [-7],
                time: "Any Time"
            },
            "PCR 2": {
                dayOffSet: [-2, -1],
                time: "Any Time"
            },
            "PCR 3": {
                dayOffSet: [-1],
                time: "Any Time",
                note: "Must be taken at a different agency from the second one."
            },
            "Antigen 1": {
                dayOffSet: [-1],
                time: "After 12:00 at Noon"
            },
        }
    },
    "DL283": {
        "Inactivated": {
            "Self-Monitoring": {
                dayOffSet: [-7, -1]
            },
            "PCR 1": {
                dayOffSet: [-7],
                time: "Any Time"
            },
            "PCR 2": {
                dayOffSet: [-2, -1, 0],
                time: "Any Time"
            },
            "PCR 3": {
                dayOffSet: [0],
                time: "Any Time",
                note: "Must be taken at a different agency from the second one."
            },
            "Antigen 1": {
                dayOffSet: [0],
                time: "After 11:00 am EDT or 10:00 am CT - Same Day Before Departure"
            },
        }
    },
    "UA857": {
        "Inactivated": {
            "Self-Monitoring": {
                dayOffSet: [-7, -1]
            },
            "PCR 1": {
                dayOffSet: [-7],
                time: "Any Time"
            },
            "PCR 2": {
                dayOffSet: [-1],
                time: "Any Time"
            },
            "PCR 3": {
                dayOffSet: [-1],
                time: "Any Time",
                note: "Taken at the same agency as the second one using different tests."
            },
            "Antigen 1": {
                dayOffSet: [-1],
                time: "After 12:00 at Noon"
            },
        }
    },
    "DL287": {
        "Inactivated": {
            "Self-Monitoring": {
                dayOffSet: [-7, -1]
            },
            "PCR 1": {
                dayOffSet: [-7],
                time: "Any Time"
            },
            "PCR 2": {
                dayOffSet: [0],
                time: "Any Time"
            },
            "PCR 3": {
                dayOffSet: [0],
                time: "Any Time",
                note: "Taken at the same agency as the second one using different tests."
            },
            "Antigen 1": {
                dayOffSet: [0],
                time: "After 12:00 at Noon - Same Day Before Departure"
            },
        }
    },
};

router.get('/getFlightDetail', async (req, res) => {
    const fltScheduleId = req.query.flightScheduleId;
    const fltSchedule = await Schedule.findOne({ _id: fltScheduleId });

    let fltTestingReq = {
        "Inactivated": {
            "Self-Monitoring": {
                dayOffSet: []
            },
            "PCR 1": {
                dayOffSet: [],
                time: ""
            },
            "PCR 2": {
                dayOffSet: [],
                time: ""
            },
            "PCR 3": {
                dayOffSet: [],
                time: "",
                note: ""
            },
            "Antigen 1": {
                dayOffSet: [],
                time: ""
            },
        }
    }

    const fltDate = date.parse(fltSchedule.flightdate, "YYYY-MM-DD");

    for (let testKey in testingRequirementMap[fltSchedule["flightno"]]["Inactivated"]) {
        const test = testingRequirementMap[fltSchedule["flightno"]]["Inactivated"][testKey];

        if (testKey === "Self-Monitoring") {
            const startDate = date.format(date.addDays(fltDate, test["dayOffSet"][0]), "YYYY-MM-DD");
            const endDate = date.format(date.addDays(fltDate, test["dayOffSet"][1]), "YYYY-MM-DD");
            fltTestingReq["Inactivated"][testKey]["dayOffSet"] = [startDate, endDate];
        } else if (testKey.indexOf("PCR") > -1) {
            fltTestingReq["Inactivated"][testKey]["dayOffSet"] = test["dayOffSet"].map(testDate => date.format(date.addDays(fltDate, testDate), "YYYY-MM-DD"));
            fltTestingReq["Inactivated"][testKey]["time"] = test["time"];
            if (test["note"]) {
                fltTestingReq["Inactivated"][testKey]["note"] = test["note"];
            }
        } else if (testKey.indexOf("Antigen") > -1) {
            const testDate = date.format(date.addDays(fltDate, test["dayOffSet"][0]), "YYYY-MM-DD");
            fltTestingReq["Inactivated"][testKey]["dayOffSet"] = [testDate];
            fltTestingReq["Inactivated"][testKey]["time"] = test["time"];
        }
    }

    res.json({ flightSchedule: fltSchedule, testingRequirement: fltTestingReq });
});

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
    } else {
        sortBy["flightdate"] = 1;
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

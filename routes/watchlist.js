const mongoose = require("mongoose");
const User = mongoose.model('User');
const Schedule = mongoose.model('Schedule');
const WatchList = mongoose.model('WatchList');

const date = require('date-and-time');
const express = require('express');
const router = express.Router();

const notify = require('../utils/notify');

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
    "AA127": {
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
                time: "After 14:00 pm"
            },
        }
    },
};

router.post('/notify', async (req, res) => {
    if (req.user) {
        if (req.user.username === "aitgrader") {
            const { watchListRecord, phoneprefix, phone } = req.body;

            const fltSchedule = await Schedule.findOne({
                flightdate: watchListRecord.flightdate,
                flightno: watchListRecord.flightno
            });

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

            const notifyMessage = `Flight No.: ${fltSchedule["flightno"]}\nDeparture Date: ${fltSchedule["flightdate"]}\nSelf-Monitoring: From ${fltTestingReq["Inactivated"]["Self-Monitoring"]["dayOffSet"][0]} to ${fltTestingReq["Inactivated"]["Self-Monitoring"]["dayOffSet"][1]}\nNumber of Required PCR Tests: 3\nNumber of Required Antigen Tests: 1\n`;

            notify.sendSMS(phoneprefix, phone, notifyMessage, res);
        } else {
            res.status(301).json({ error: 2, message: "Access Denied" });
        }
    } else {
        res.json({ error: 1, message: "You need to login first" });
    }
});

router.post('/delete', async (req, res) => {
    const watchListRecord = req.body;

    if (req.user) {
        const myWatchList = await WatchList.deleteOne({
            _id: watchListRecord._id,
        });
        res.json({ success: 1, deletedCount: myWatchList.deletedCount });
    } else {
        res.json({ error: 1, message: "You need to login first" });
    }
});

router.get('/get', async (req, res) => {
    if (req.user) {
        const myWatchList = await WatchList.find({
            userid: req.user._id
        }).sort({ flightdate: 1 }).exec();
        res.json({ success: 1, rows: myWatchList });
    } else {
        res.json({ error: 1, message: "You need to login first" });
    }
});

router.post('/add', async (req, res) => {
    const fltSchedule = req.body;

    if (req.user) {
        const totalCount = await WatchList.countDocuments({
            userid: req.user._id,
            flightno: fltSchedule.flightno,
            flightdate: fltSchedule.flightdate
        });

        if (totalCount === 0) {
            const savedResult = await new WatchList({
                userid: req.user._id,
                flightno: fltSchedule.flightno,
                flightdate: fltSchedule.flightdate
            }).save();
            res.json({ success: 1, addedWatchList: savedResult });
        } else {
            res.json({ error: 2, message: "This flight is already in your watch list" });
        }
    } else {
        res.json({ error: 1, message: "You need to login first" });
    }
});

module.exports = router;

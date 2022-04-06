require('../db');
const fs = require('fs');
const path = require('path');
const mongoose = require("mongoose");

const Schedule = mongoose.model('Schedule');

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function importFromFile(filePath, mode) {
    filePath = path.resolve(__dirname, filePath);

    fs.readFile(filePath, (err, jsonString) => {
        if (err) {
            console.log("[ERROR]: File read failed", err);
            return;
        }

        const data = JSON.parse(jsonString);

        for (flightRoute in data) {
            const flightSchedules = data[flightRoute];

            for (let i = 0; i < flightSchedules.length; i++) {
                const flightSchedule = flightSchedules[i];

                const schedule = new Schedule({
                    airline: flightSchedule.airline,
                    flightno: flightSchedule.fltNo,
                    flightdate: formatDate(new Date(flightSchedule.fltDate)),
                    flightschedule: flightSchedule.fltSchedule,
                    flightplan: flightSchedule.fltPlan,
                    depcity: flightSchedule.ori,
                    arrcity: flightSchedule.arr,
                    stops: flightSchedule.importer,
                    technicalstop: flightSchedule.importer.indexOf("技术经停") !== -1
                });

                // schedule.save(function (err, saveResult) {
                //     if (err) {
                //         console.log("[ERROR]: Save record error", err);
                //         return;
                //     }
                // });

                break;
            }

            break;
        }
    });
}

importFromFile("../data/plans.json", "w");
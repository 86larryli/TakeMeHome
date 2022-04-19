require('./db');
const fs = require('fs');
const path = require('path');
const mongoose = require("mongoose");

const Schedule = mongoose.model('Schedule');

function importFromFile(filePath) {
    filePath = path.resolve(__dirname, filePath);

    fs.readFile(filePath, (err, jsonString) => {
        if (err) {
            console.log("[ERROR]: File read failed", err);
            return;
        }

        const data = JSON.parse(jsonString);

        for (let flightRoute in data) {
            const flightSchedules = data[flightRoute];

            for (let flightSchedule of flightSchedules) {
                const schedule = new Schedule({
                    airline: flightSchedule.airline,
                    flightno: flightSchedule.fltNo,
                    flightdate: flightSchedule.fltDate,
                    flightday: flightSchedule.fltDay,
                    flightplan: flightSchedule.fltPlan,
                    depcity: flightSchedule.ori,
                    arrcity: flightSchedule.arr,
                    stops: flightSchedule.importer,
                    technicalstop: flightSchedule.importer.indexOf("Technical Stop") !== -1
                });

                schedule.save(function (err, saveResult) {
                    if (err) {
                        console.log("[ERROR]: Save record error", err);
                        return;
                    }
                    console.log(`[INFO] Saved schedule id: ${saveResult._id}`);
                });
            }
        }
    });
}

importFromFile("../data/plans_cleaned_en.json");
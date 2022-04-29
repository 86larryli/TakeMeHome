const mongoose = require("mongoose");
const User = mongoose.model('User');
const WatchList = mongoose.model('WatchList');

const date = require('date-and-time');
const express = require('express');
const router = express.Router();

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

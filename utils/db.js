const path = require('path');
const config = require('../config');

const mongoose = require('mongoose');

const Schedule = new mongoose.Schema({
	airline: { type: String, required: true },
	flightno: { type: String, required: true },
	flightdate: { type: String, required: true },
	flightday: { type: String, required: true },
	flightplan: { type: String, required: true },
	depcity: { type: String, required: true },
	arrcity: { type: String, required: true },
	stops: { type: Object, required: true },
	technicalstop: { type: Number, required: true }
});

const WatchList = new mongoose.Schema({
	userid: { type: String, required: true },
	flightno: { type: String, required: true },
	startdate: { type: Date, required: true },
	enddate: { type: Date, required: true },
	watchtype: { type: Number, required: true }
});

mongoose.model('Schedule', Schedule);
mongoose.model('WatchList', WatchList);

if (config.MODE === "DEV") {
	mongoose.connect("mongodb://localhost:27017/takemehome-dev");
} else {
	mongoose.connect(config.DATABASE_URL, {
		ssl: true,
		sslValidate: true,
		sslCA: config.DATABASE_CA_PATH,
		retryWrites: false,
	}).catch(error => {
		console.log("[ERROR] Failed to connect database", error);
	});
}

mongoose.connection.on('connecting', () => {
	console.log("[INFO] Connecting to database...");
});

mongoose.connection.on('connected', () => {
	console.log("[INFO] Connected to database!")
});
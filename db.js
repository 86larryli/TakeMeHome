const path = require('path');
const config = require('./config');

const mongoose = require('mongoose');
// const URLSlugs = require('mongoose-url-slugs'),
// const passportLocalMongoose = require('passport-local-mongoose');


// const User = new mongoose.Schema({
// 	// username, password
// });

const Schedule = new mongoose.Schema({
	airline: { type: String, required: true },
	flightno: { type: String, required: true },
	flightdate: { type: Date, required: true },
	flightschedule: { type: String, required: true },
	flightplan: { type: String, required: true },
	depcity: { type: String, required: true },
	arrcity: { type: String, required: true },
	stops: { type: Object, required: true },
	technicalstop: { type: Number, required: true }
}, {
	_id: true
});

const WatchList = new mongoose.Schema({
	userid: { type: String, required: true },
	flightno: { type: String, required: true },
	startdate: { type: Date, required: true },
	enddate: { type: Date, required: true },
	watchtype: { type: Number, required: true }
}, {
	_id: true
});

// User.plugin(passportLocalMongoose);

// mongoose.model('User', User);
mongoose.model('Schedule', Schedule);
mongoose.model('WatchList', WatchList);

console.log("config.DATABASE_URL", config.DATABASE_URL);

mongoose.connect(config.DATABASE_URL, {
	ssl: true,
	sslValidate: true,
	sslCA: config.DATABASE_CA_PATH,
	retryWrites: false,
}).on('error', err => {
	console.log("[ERROR] Failed to connect database", err);
}).on('connecting', () => {
	console.log("[INFO] Connecting to database...")
}).on('connected', () => {
	console.log("[INFO] Connected to database!")
});
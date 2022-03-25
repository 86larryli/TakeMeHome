const mongoose = require('mongoose'),
	URLSlugs = require('mongoose-url-slugs'),
	passportLocalMongoose = require('passport-local-mongoose');


const User = new mongoose.Schema({
	// username, password
});

const Country = new mongoose.Schema({
	countryname: { type: String, required: true }
}, {
	_id: true
});

const City = new mongoose.Schema({
	countryid: { type: String, required: true },
	cityname: { type: String, required: true }
}, {
	_id: true
});

const Airport = new mongoose.Schema({
	cityid: { type: String, required: true },
	airportcode: { type: String, required: true }
}, {
	_id: true
});

const Airline = new mongoose.Schema({
	countryid: { type: String, required: true },
	airlinename: { type: String, required: true }
}, {
	_id: true
});

const Schedule = new mongoose.Schema({
	airlineid: { type: String, required: true },
	flightno: { type: String, required: true },
	flightdate: { type: Date, required: true },
	flightschedule: { type: String, required: true },
	flightplan: { type: String, required: true },
	depcityid: { type: String, required: true },
	arrcityid: { type: String, required: true },
	stopno: { type: Number, required: true },
	stops: { type: Object, required: true }
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


User.plugin(passportLocalMongoose);

mongoose.model('User', User);
mongoose.model('Country', Country);
mongoose.model('City', City);
mongoose.model('Airport', Airport);
mongoose.model('Airline', Airline);
mongoose.model('Schedule', Schedule);
mongoose.model('WatchList', WatchList);

mongoose.connect('mongodb://localhost/takemehome-dev');

var express = require('express')
	, app = express()
	, http = require('http').Server(app)
	, socket = require('socket.io').listen(http)
	, morgan = require('morgan')
	, log = require('./log');

// Server Configuration

morgan.token('id', function (req) {
	return req.id;
});

app.use(function (req, res, next) {
	req.id = require('node-uuid').v4();
	next();
});

app.use(require('express-session')({
	resave: true,
	saveUninitialized: true,
	secret: '093uej3fdhn239eyh3en9fdu30eij3oubf93wyr30284hn39ufu3028jed3pidj30dj3odn39ifuy9ehj23em23ee32eded',
	genid: function (req) {
		return require('node-uuid').v4();
	},
	cookie: {
		maxAge: 60000
	}
}));

app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('body-parser').json({ extended: true }));

app.use(morgan(log.http.string, { stream: log.http.stream }));

module.exports = {
	app: app,
	http: http,
	socket: socket
};
var fileStreamRotator = require('file-stream-rotator')
	, fs = require('fs')

var logDirectory = './log';
var logString = 'ID: :id \t method: :method \t route: :url \t status: :status \t response: :response-time ms';

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

var options = function (item) {
	return {
		filename: logDirectory + '/' + item + '_%DATE%.log',
		frequency: 'daily',
		verbose: false,
		date_format: "YYYY-MM-DD"
	};
}

var accessLog = fileStreamRotator.getStream(options("HTTP"));

var sqlLog = fileStreamRotator.getStream(options("SQL"));

var accountLog = fileStreamRotator.getStream(options("ACCOUNT"));

module.exports = {
	sql: sqlLog,
	http: {
		stream: accessLog,
		string: logString
	},
	account: accountLog,
	httpString: logString
};
var server = require('./../configs/server');

var homeAction = function (req, res) {
	res.sendFile(process.cwd() + '/app/views/index.html');
};

server.app.get('/', homeAction);
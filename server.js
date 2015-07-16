var server = require('./lib/configs/server');
var passport = require('./lib/configs/authentication');
var models = require('./lib/models');
var sql = require('./lib/configs/sql');
var controllers = require('./lib/controllers');

sql.sync();

server.socket.on('connection', function () {
	server.socket.emit('notification', {
		error: false,
		message: "Connected to update service"
	});
});

// Janky redirect of notification, might be useless keeping enabled until making sure it is useless
server.socket.on('notification', function (data) {
	server.socket.emit('notification', data);
});

server.app.use(require('express').static(__dirname + '/app'));

server.app.post('/githubHook', function (req, res) {
	var ps = require('edge').func('ps', function(){
		/*
			cd C:\Users\Administrator\Desktop\Node\WhySoCirrusFinal
			git pull
		*/
	});
	ps('',function(err, result){
		//console.log(result);
	});
	res.sendStatus(200);
});

server.http.listen(80, function () {
	console.log('Listening at http://%s:%s ', this.address().address, this.address().port);
});
var server = require('./../configs/server')
	, passport = require('./../configs/authentication')
	, models = require('./../models');

// Controllers
var loginAction = function (req, res) {
	res.json({
		id: req.user.id,
		token: req.user.generateToken()
	});
};

// [TODO:David] Switch over to authentication against redis
var authAction = function (req, res) {
	console.log(req.body.token);
	switch (req.body.token) {
		case undefined:
			res.sendStatus(401);
			break;
		default:
			models.User.findOne({ where: { tokenCode: req.body.token } }).then(function (user) {
				switch (user) {
					case null:
						res.sendStatus(401);
						break;
					default:
						if (((new Date().getTime()) - (new Date(user.tokenTTL).getTime())) > 3600000)
							res.sendStatus(401);
						else
							res.sendStatus(200);
						break;
				}
			});
			break;
	};
};

var deauthAction = function (req, res) {
	switch (req.body.userID) {
		case undefined:
			res.sendStatus(404);
			break;
		default:
			models.User.findOne({ where: { id: req.body.userId } }).then(function (user) {
				switch (user) {
					case null:
						res.sendStatus(404);
						break;
					default:
						user.generateToken();
						res.sendStatus(200);
						break;
				};
			});
			break;
	};
};

server.app.post('/login', passport.authenticate('WindowsAuthentication'), loginAction);
server.app.post('/login/authenticate', authAction);
server.app.post('/login/deauthenticate', deauthAction);
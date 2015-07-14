var server = require('./../configs/server')
	, models = require('./../models');


var getAction = function (req, res) {
	models[req.params.model].findById(req.params.id).then(function (object) {
		if (object == null)
			res.sendStatus(404);
		else
			res.json(object);
	});
};

var putAction = function (req, res) {
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
							models[req.params.model].findById(req.body.object.id).then(function (object) {
								if (object == null)
									res.sendStatus(404);
								else {
									for (var property in req.body.object) {
										if (typeof object[property] !== 'function') {
											object[property] = req.body.object[property];
										}
									}
									object.save();
									res.sendStatus(200);
								}
							});
						break;
				}
			});
			break;
	};
};

server.app.get('/api/:model/:id', getAction);
server.app.put('/api/:model', putAction);
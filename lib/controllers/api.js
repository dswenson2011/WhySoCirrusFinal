var server = require('./../configs/server')
	, models = require('./../models');


var getAction = function (req, res) {
	models[req.params.model].findById(req.params.id).then(function (user) {
		if (user == null)
			res.sendStatus(404);
		else
			res.json(user);
	});
};

server.app.get('/api/:model/:id', getAction);
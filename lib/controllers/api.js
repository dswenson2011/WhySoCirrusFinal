var server = require('./../configs/server');

var getAction = function (req, res) {
	console.log(req.param.model);
	console.log(req.params.id);
};

server.app.get('/:model/:id', getAction);
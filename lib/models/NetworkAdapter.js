var Sequelize = require('sequelize')
	, server = require('../configs/server');
var NetworkAdapter = require('../configs/sql').define('NetworkAdapter', {
	name: {
		type: Sequelize.STRING
	},
	external: {
		type: Sequelize.BOOLEAN
	}
});

module.exports = NetworkAdapter;
var Sequelize = require('sequelize')
	, server = require('../configs/server');
var OperatingSystem = require('../configs/sql').define('OperatingSystem', {
	name: {
		type: Sequelize.STRING
	},
	templateDrive: {
		type: Sequelize.STRING
	}
});

module.exports = OperatingSystem;
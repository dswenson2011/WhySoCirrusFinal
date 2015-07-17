var Sequelize = require('sequelize')
	, server = require('../configs/server');
var VirtualMachine = require('../configs/sql').define('VirtualMachine', {
	name: {
		type: Sequelize.STRING
	},
	vmId: {
		type: Sequelize.STRING
	},
	cpu: {
		type: Sequelize.INTEGER
	},
	networkAdapter:{
		type: Sequelize.INTEGER
	},
	hardDrive: {
		type: Sequelize.INTEGER
	},
	operatingSystem: {
		type: Sequelize.INTEGER
	}
});

module.exports = VirtualMachine; 
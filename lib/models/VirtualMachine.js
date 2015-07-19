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
	ram: {
		type: Sequelize.INTEGER
	},
	networkAdapter: {
		type: Sequelize.STRING
	},
	hardDrive: {
		type: Sequelize.INTEGER
	},
	operatingSystem: {
		type: Sequelize.STRING
	}
});

VirtualMachine.addHook('afterCreate', function (attr) {
	console.log(attr);
	console.log('Created');
});

module.exports = VirtualMachine; 
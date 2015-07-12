var Sequelize = require('sequelize')
	, server = require('../configs/server');
var VirtualMachine = require('../configs/sql').define('VirtualMachine', {
	name: {
		type: Sequelize.STRING
	},
	windowsId: {
		type: Sequelize.STRING
	}
});

module.exports = VirtualMachine; 
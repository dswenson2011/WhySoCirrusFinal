var Sequelize = require('sequelize')
	, sqlConfig = require('./.sqlConfig')
	, log = require('./log')
	, sequelize = new Sequelize(sqlConfig.database, sqlConfig.username, sqlConfig.password, {
		host: sqlConfig.host,
		dialect: sqlConfig.dialect,
		logging: function (itemToLog) {
			log.sql.write(itemToLog + '\n');
		},
		define: {
			timestamps: true,
			paranoid: true,
			freezeTableName: true
		}
	});

module.exports = sequelize;
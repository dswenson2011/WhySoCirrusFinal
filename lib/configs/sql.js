var Sequelize = require('sequelize')
	, server = require('./server')
	, sqlConfig = require('./config').sql
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

sequelize.addHook('afterUpdate', function (instance) {
	server.socket.emit('updatedModel', { model: instance['__options']['name']['singular'], id: instance.id });
});

module.exports = sequelize;
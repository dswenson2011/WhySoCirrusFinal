var Sequelize = require('sequelize')
	, server = require('../configs/server');
var User = require('../configs/sql').define('User', {
	firstName: {
		type: Sequelize.STRING,
	},
	lastName: {
		type: Sequelize.STRING
	},
	displayName: {
		type: Sequelize.STRING
	},
	title: {
		type: Sequelize.STRING
	},
	windowsId: {
		type: Sequelize.STRING
	},
	primaryGroup: {
		type: Sequelize.STRING
	},
	groupList: {
		type: Sequelize.TEXT,
		set: function (val) {
			var finalString = '';
			if (val != null && val != undefined) {
				for (var i = 0; i < val.length; i++) {
					var coms = val[i].split(',');
					if (i + 1 == val.length) {
						finalString += coms[0].replace('CN=', '') + ',';
					} else {
						finalString += coms[0].replace('CN=', '') + ',';
					}
				}
			}else{
				finalString = "guest"
			}
			this.setDataValue('groupList', finalString);
		},
		get: function () {
			return this.getDataValue('groupList').split(',');
		}
	},
	avatar: {
		type: Sequelize.STRING
	},
	tokenTTL: {
		type: Sequelize.DATE
	},
	tokenCode: {
		type: Sequelize.STRING
	}
}, {
		instanceMethods: {
			generateToken: function () {
				this.tokenTTL = new Date();
				this.tokenCode = require('node-uuid').v1()
				this.save();
				return this.tokenCode;
			},
			validateToken: function (token) {
				var moment = require('moment');
				var now = moment(new Date());
				var ttl = moment(new Date(this.tokenTTL));
				if (this.tokenCode == token) {
					if (now.diff(ttl, 'hours', true) <= 1) {
						return { error: false, message: "Authorized" };
					}
					return { error: true, message: "Regenerate token" };
				}
				return { error: true, message: "Invalid token" };
			}
		}
	});
module.exports = User;
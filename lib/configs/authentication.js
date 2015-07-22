var passport = require('passport')
	, WindowsStrategy = require('passport-windowsauth')
	, server = require('./server')
	, fs = require('fs')
	, log = require('./log')
	, models = require('../models');

passport.use(new WindowsStrategy({
	ldap: require('./config').ldap,
	integrated: false
}, function (profile, done) {
	if (profile != null && profile != undefined) {
		models.User.findOrCreate({
			where: {
				windowsId: profile.id
			}, defaults: {
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				title: profile._json.description,
				displayName: profile.displayName,
				primaryGroup: profile._json.primaryGroupID,
				groupList: profile._json.memberOf
			}
		}).spread(function (user, created) {
			log.account.write('User ' + user.displayName + ' logged in with the id of ' + user.windowsId + ' on ' + new Date().toDateString() + ' @ ' + new Date().toTimeString() + '\n');
			done(null, user);
		});
		return;
	}
	return done(null, false, "Invalid credentials");
}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	models.User.findById(id).then(function (user) {
		done(null, user);
	});
});

server.app.use(passport.initialize());
server.app.use(passport.session());

module.exports = passport;
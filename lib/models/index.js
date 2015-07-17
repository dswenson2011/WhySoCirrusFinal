require('fs').readdirSync(__dirname + '/').forEach(function (file) {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    var name = file.replace('.js', '');
    exports[name] = require('./' + file);
  }
});

exports['VirtualMachine'].hasOne(exports['OperatingSystem'], { foreignKey: 'operatingSystem' });
exports['VirtualMachine'].hasMany(exports['NetworkAdapter'], { foreignKey: 'networkAdapter' });
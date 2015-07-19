var server = require('./lib/configs/server');
var passport = require('./lib/configs/authentication');
var models = require('./lib/models');
var sql = require('./lib/configs/sql');
var controllers = require('./lib/controllers');

sql.sync();

server.socket.on('connection', function () {
	server.socket.emit('notification', {
		error: false,
		message: "client connected"
	});
});

server.app.use(require('express').static(__dirname + '/app'));

server.app.get('/VMs', function (req, res) {
	require('edge')
		.func('ps', function () {
			/*
			$credential = New-Object System.Management.Automation.PsCredential("domware\Administrator", (ConvertTo-SecureString "W3ntw0rth@boston" -AsPlainText -Force))
			$s = New-PSSession -ComputerName 69.43.72.131 -Credential $credential
			function a(){Get-VM|ConvertTo-JSON}
			Invoke-Command -Session $s -ScriptBlock ${function:a}
			Remove-PSSession $s
			*/
		})('', function (error, result) {
			console.log(error);
			console.log(result);
			res.json(JSON.parse(result));
		}, true);
});

server.app.get('/test', function (req, res) {
	// { 'path': 'C:\\VHDS\\Test10.vhdx', 'name': 'Test10', 'ram': '2147483648','hardDrive': '8589934592'}
	var object = { 'path': 'C:\\VHDS\\' + req.query.name + '.vhdx', 'name': '' + req.query.name + '', 'ram': '2147483648', 'hardDrive': '8589934592' };
	console.log(object);
	require('edge')
		.func('ps', function () {
			/*
			$credential = New-Object System.Management.Automation.PsCredential("domware\Administrator", (ConvertTo-SecureString "W3ntw0rth@boston" -AsPlainText -Force))
			$s = New-PSSession -ComputerName peter.dell.whysocirr.us -Credential $credential
			$object =  ${inputFromJS} | ConvertFrom-Json
			$object
			function a($input){$input = $input | ConvertTo-Json | ConvertFrom-Json; New-VM –Name $input.name –MemoryStartupBytes $input.ram –NewVHDPath $input.path -NewVHDSizeBytes $input.hardDrive | ConvertTo-JSON}
			Invoke-Command -Session $s -ScriptBlock ${function:a} -inputObject ${object}
			Remove-PSSession $s
			*/
		})(JSON.stringify(object), function (error, result) {
			console.log(error);
			console.log(result);
			res.json(JSON.parse(result));
		}, true);
});

server.app.post('/githubHook', function (req, res) {
	var ps = require('edge').func('ps', function () {
		/*
			cd C:\Users\Administrator\Desktop\Node\WhySoCirrusFinal
			git pull
		*/
	});
	ps('', function (err, result) {
		//console.log(result);
	});
	res.sendStatus(200);
});

server.http.listen(80, function () {
	console.log('Listening at http://%s:%s ', this.address().address, this.address().port);
});
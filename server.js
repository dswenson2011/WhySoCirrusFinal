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
			$credential = New-Object System.Management.Automation.PsCredential("domware\Administrator", (ConvertTo-SecureString "${InputFromJS}" -AsPlainText -Force))
			$s = New-PSSession -ComputerName peter.dell.whysocirr.us -Credential $credential
			function a(){Get-VM|ConvertTo-JSON}
			Invoke-Command -Session $s -ScriptBlock ${function:a}
			Remove-PSSession $s
			*/
		})(require('./.nodeConfig.json').password, function (error, result) {
			console.log(error);
			console.log(result);
			res.json(JSON.parse(result));
		}, true);
});

server.app.get('/test', function (req, res) {
	// { 'path': 'D:\\VHDS\\ChainTest.vhdx', 'name': 'Test10', 'ram': '2147483648','hardDrive': '8589934592', 'network': 'ExternalSwitch', 'os': 'C:\\isos\\windowsDesktop.iso'}
	//Filter name to remove stuff that ntfs doesn't like
	var object = { 'password': require('./.nodeConfig.json').password, 'path': 'D:\\VHDS\\' + req.query.name + '.vhdx', 'name': '' + req.query.name + '', 'ram': '2147483648', 'hardDrive': '8589934592', 'network': 'ExternalSwitch', 'os': 'C:\\isos\\windowsDesktop.iso' };
	console.log(object);
	require('edge')
		.func('ps', function () {
			/*
			$object =  ${inputFromJS} | ConvertFrom-Json
			$credential = New-Object System.Management.Automation.PsCredential("domware\Administrator", (ConvertTo-SecureString "${object.password}" -AsPlainText -Force))
			$s = New-PSSession -ComputerName peter.dell.whysocirr.us -Credential $credential
			function a($input){$input = $input | ConvertTo-Json | ConvertFrom-Json; New-VM –Name $input.name –MemoryStartupBytes $input.ram –NewVHDPath $input.path -NewVHDSizeBytes $input.hardDrive | ConvertTo-JSON}
			Invoke-Command -Session $s -ScriptBlock ${function:a} -inputObject ${object}
			function a($input){$input = $input | ConvertTo-Json | ConvertFrom-Json; Connect-VMNetworkAdapter -VMName $input.name  -Name  'Network Adapter'  -SwitchName $input.network | ConvertTo-JSON}
			Invoke-Command -Session $s -ScriptBlock ${function:a} -inputObject ${object}
			function a($input){$input = $input | ConvertTo-Json | ConvertFrom-Json; Add-VMDvdDrive -VMName $input.name -Path $input.os | ConvertTo-JSON}
			Invoke-Command -Session $s -ScriptBlock ${function:a} -inputObject ${object}
			function a($input){$input = $input | ConvertTo-Json | ConvertFrom-Json; Start-VM -Name $input.name | ConvertTo-JSON}
			Invoke-Command -Session $s -ScriptBlock ${function:a} -inputObject ${object}
			Remove-PSSession $s
			*/
		})(JSON.stringify(object), function (error, result) {
			console.log(error);
			console.log(result);
			res.send(JSON.parse(result));
		}, true);
});

server.app.post('/githubHook', function (req, res) {
	require('edge').func('ps', function () {
		/*
			cd C:\Users\Administrator\Desktop\Node\WhySoCirrusFinal
			git pull
		*/
	})('', function (err, result) { });
	res.sendStatus(200);
});

server.http.listen(80, function () {
	console.log('Listening at http://%s:%s ', this.address().address, this.address().port);
});
var server = require('./../configs/server');
var host = require('./../configs/config').host;
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
		})(host.password, function (error, result) {
			console.log(error);
			console.log(result);
			res.json(JSON.parse(result));
		}, true);
});

server.app.get('/test', function (req, res) {

	var object = { 'password': host.password, 'path': 'D:\\VHDS\\' + req.query.name + '.vhdx', 'name': '' + req.query.name + '', 'ram': '2147483648', 'hardDrive': '8589934592', 'network': 'ExternalSwitch', 'os': 'C:\\isos\\windowsDesktop.iso' };
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
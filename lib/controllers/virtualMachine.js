var server = require('./../configs/server');
var host = require('./../configs/config').host;
// [TODO:David] Rewrite this whole controller to match the other virtual items
server.app.get('/VM', function (req, res) {
	require('edge')
		.func('ps', function () {
			/*
			$object =  ${inputFromJS} | ConvertFrom-JSON
			$credential = New-Object System.Management.Automation.PsCredential($object.username, (ConvertTo-SecureString $object.password -AsPlainText -Force))
			$s = New-PSSession -ComputerName $object.host -Credential $credential
			function a(){Get-VM|ConvertTo-JSON}
			Invoke-Command -Session $s -ScriptBlock ${function:a}
			Remove-PSSession $s
			*/
		})(JSON.stringify(host), function (error, result) {
			console.log(error);
			console.log(result);
			try {
				res.json(JSON.parse(result));
			} catch (error) {
				res.sendStatus(500).send(error);
			}
		}, true);
});

server.app.post('/VM/Create', function (req, res) {

	host.object = {};
	host.object.Name = req.body.vm.name;
	host.object.CPU = req.body.vm.cpu
	host.object.Ram = String(parseInt(req.body.vm.ram) * 1000000);
	host.object.Path = req.body.vm.virtualDisk;
	host.object.Network = req.body.vm.virtualSwitch;
	console.log(host);
	require('edge')
		.func('ps', function () {
			/*
			$object =  ${inputFromJS} | ConvertFrom-JSON
			$credential = New-Object System.Management.Automation.PsCredential($object.username, (ConvertTo-SecureString $object.password -AsPlainText -Force))
			$s = New-PSSession -ComputerName $object.host -Credential $credential
			function a($input){$input = $input | ConvertTo-Json | ConvertFrom-Json; New-VM –Name $input.Name –MemoryStartupBytes $input.Ram -VHDPath $input.Path -SwitchName $input.Network | ConvertTo-JSON}
			Invoke-Command -Session $s -ScriptBlock ${function:a} -inputObject $object.object
			function a($input){$input = $input | ConvertTo-Json | ConvertFrom-Json; Set-VMProcessor $input.Name -Count $input.CPU -Reserve 10 -Maximum 75 -RelativeWeight 200 | ConvertTo-JSON}
			Invoke-Command -Session $s -ScriptBlock ${function:a} -inputObject $object.object
			function a($input){$input = $input | ConvertTo-Json | ConvertFrom-Json; Start-VM -Name $input.Name | ConvertTo-JSON}
			Invoke-Command -Session $s -ScriptBlock ${function:a} -inputObject $object.object
			Remove-PSSession $s
			*/
		})(JSON.stringify(host), function (error, result) {
			console.log(error);
			console.log(result);
			try {
				result = JSON.parse(result);
				res.json(result);
			} catch (error) {
				res.status(500).send(error);
			}
		}, true);
});
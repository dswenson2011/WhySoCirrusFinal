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

	host.object = {
		"Name": req.body.vm.name,
		"CPU": req.body.vm.cpu,
		"Ram": String(parseInt(req.body.vm.ram) * 1000000000),
		"Path": req.body.vm.virtualDisk,
		"Network": req.body.vm.virtualSwitch

	};
	require('edge')
		.func('ps', function () {
			/*
			$object =  ${inputFromJS} | ConvertFrom-JSON
			$credential = New-Object System.Management.Automation.PsCredential($object.username, (ConvertTo-SecureString $object.password -AsPlainText -Force))
			function a($input){$input = $input | ConvertTo-Json | ConvertFrom-Json; New-VM –Name $input.Name –MemoryStartupBytes $input.Ram -VHDPath $input.Path -SwitchName $input.Network | ConvertTo-JSON}
			Invoke-Command -Session $s -ScriptBlock ${function:a} -inputObject ${object}
			function a($input){$input = $input | ConvertTo-Json | ConvertFrom-Json; Set-VMProcessor $input.Name -Count $input.CPU -Reserve 10 -Maximum 75 -RelativeWeight 200 | ConvertTo-JSON}
			Invoke-Command -Session $s -ScriptBlock ${function:a} -inputObject ${object}
			function a($input){$input = $input | ConvertTo-Json | ConvertFrom-Json; Start-VM -Name $input.Name | ConvertTo-JSON}
			Invoke-Command -Session $s -ScriptBlock ${function:a} -inputObject ${object}
			Remove-PSSession $s
			*/
		})(JSON.stringify(host), function (error, result) {
			console.log(error);
			console.log(result);
			try {
				result = JSON.parse(result);
				res.json(result);
			} catch (error) {
				res.sendStatus(500).send(error);
			}
		}, true);
});
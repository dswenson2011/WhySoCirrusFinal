var server = require('./../configs/server');
var host = require('./../configs/config').host;
var edge = require('edge');

function CreateVS(req, res) {
	req.body.token;
	var object = req.body.vs;
	object.MinimumBandwidthMode = "Weight";
	host.object = object;
	console.log(JSON.stringify(host));
	console.log(host);
	edge.func('ps', function () {
		/*
		$object =  ${inputFromJS} | ConvertFrom-JSON
		$credential = New-Object System.Management.Automation.PsCredential($object.username, (ConvertTo-SecureString $object.password -AsPlainText -Force))
		$s = New-PSSession -ComputerName $object.host -Credential $credential
		function a($input){$input = $input | ConvertTo-JSON | ConvertFrom-Json; New-VMSwitch -Name $input.Name -MinimumBandwidthMode $input.MinimumBandwidthMode -SwitchType $input.SwitchType | ConvertTo-JSON}
		Invoke-Command -Session $s -ScriptBlock ${function:a} -inputObject $object.object
		Remove-PSSession $s
		*/
	})(JSON.stringify(host), function (error, result) {
		console.log(error);
		console.log(result);
		if(result)
		try {
			result = JSON.parse(result);
			
		} catch (error) {
			console.log(error);
			res.status(500).send('Could not create new virtual switch');
		}
	}, true);
};

function GetVS(req, res) {
	console.log(JSON.stringify(host));
	edge.func('ps', function () {
		/*
		$object =  ${inputFromJS} | ConvertFrom-JSON
		$credential = New-Object System.Management.Automation.PsCredential($object.username, (ConvertTo-SecureString $object.password -AsPlainText -Force))
		$s = New-PSSession -ComputerName $object.host -Credential $credential
		function a(){Get-VMSwitch | ConvertTo-JSON}
		Invoke-Command -Session $s -ScriptBlock ${function:a}
		Remove-PSSession $s
		*/
	})(JSON.stringify(host), function (error, result) {
		console.log(error);
		console.log(result);
		res.json(JSON.parse(result));
	}, true);
};

function DeleteVS(req, res) {
	req.body.token;
	console.log(host);
	host.object = {
		"Id": req.params.id
	};
	console.log(JSON.stringify(host));
	edge.func('ps', function () {
		/*
		$object =  ${inputFromJS} | ConvertFrom-JSON
		$credential = New-Object System.Management.Automation.PsCredential($object.username, (ConvertTo-SecureString $object.password -AsPlainText -Force))
		$s = New-PSSession -ComputerName $object.host -Credential $credential
		function a($input){$input = $input | ConvertTo-JSON | ConvertFrom-Json; $switch = Get-VMSwitch -Id $input.Id; Remove-VMSwitch -VMSwitch $switch -Force | ConvertTo-JSON}
		Invoke-Command -Session $s -ScriptBlock ${function:a} -inputObject $object.object
		Remove-PSSession $s
		*/
	})(JSON.stringify(host), function (error, result) {
		console.log(error);
		console.log(result);
		res.json({ 'success': true });
	}, true);
}

server.app.get('/VS/', GetVS);
server.app.post('/VS/Create', CreateVS);
server.app.delete('/VS/Delete/:id', DeleteVS);
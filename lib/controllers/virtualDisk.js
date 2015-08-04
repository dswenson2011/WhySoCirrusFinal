var server = require('./../configs/server');
var host = require('./../configs/config').host;
var edge = require('edge');
var MongoClient = require('mongodb').MongoClient

function GetVD(req, res) {
	MongoClient.connect('mongodb://127.0.0.1:27017/', function (err, db) {
		var disks = db.collection('virtualDisks');
		disks.find().toArray(function (err, results) {
			if (err)
				return res.json([]);
			res.json(results);
			db.close();
		});
	});
};
function CreateVD(req, res) {
	host.object = {
		"Path": "D:\\VHDS\\Guest\\" + req.body.vd.name + ".vhdx",
		"ParentPath": "D:\\VHDS\\Master\\" + req.body.vd.operatingSystem + ".vhdx",
		"Size": parseInt(req.body.vd.size) * 1000000000
	};
	console.log(host);
	edge.func('ps', function () {
		/*
		$object =  ${inputFromJS} | ConvertFrom-JSON
		$credential = New-Object System.Management.Automation.PsCredential($object.username, (ConvertTo-SecureString $object.password -AsPlainText -Force))
		$s = New-PSSession -ComputerName $object.host -Credential $credential
		function a(){New-VHD -Path ${object.Path} -ParentPath ${object.ParentPath} -SizeBytes ${object.Size} -Differencing | ConvertTo-JSON}
		Invoke-Command -Session $s -ScriptBlock ${function:a} -inputObject $object.object
		Remove-PSSession $s
		*/
	})(JSON.stringify(host), function (error, result) {
		console.log(result);
		try {
			result = JSON.parse(result);
			MongoClient.connect('mongodb://127.0.0.1:27017/', function (err, db) {
				var disks = db.collection('virtualDisks');
				disks.insert(result, function (err, disk) {
					res.json({ 'success': true });
				});
			});
		} catch (error) {
			res.status(500).send(error);
		}
	}, true);
};
function DeleteVD(req, res) {
	// [TODO:David] Figure out if it is just a dismount or if we can actually delete the VHD without going into MS storage cmdlets
	edge.func('ps', function(){
		/*
		$object =  ${inputFromJS} | ConvertFrom-JSON
		$credential = New-Object System.Management.Automation.PsCredential($object.username, (ConvertTo-SecureString $object.password -AsPlainText -Force))
		$s = New-PSSession -ComputerName $object.host -Credential $credential
		function a(){New-VHD -Path $object.Path -ParentPath $object.ParentPath -SizeBytes $object.Size  -Differencing | ConvertTo-JSON}
		Invoke-Command -Session $s -ScriptBlock ${function:a} -inputObject $object.object
		Remove-PSSession $s
		*/
	})({}, function(error, result){
		
	});
};


server.app.get('/VD/', GetVD);
server.app.post('/VD/Create', CreateVD);
server.app.delete('/VD/Delete/:id', DeleteVD);
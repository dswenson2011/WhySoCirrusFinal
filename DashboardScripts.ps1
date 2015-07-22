# Get Total of Memory in Gigabytes for Running VMs
$credential = New-Object System.Management.Automation.PsCredential("", (ConvertTo-SecureString "" -AsPlainText -Force))
$s = New-PSSession -ComputerName "" -Credential $credential
function a(){$total = 0;Get-VM | Where-Object { $_.State -eq "Running" } | Select-Object Name, MemoryAssigned | ForEach-Object { $total = $total + $_.MemoryAssigned };$total / 1GB}
Invoke-Command -Session $s -ScriptBlock ${function:a}
Remove-PSSession $s

# Get Uptime of running VMs
$credential = New-Object System.Management.Automation.PsCredential("", (ConvertTo-SecureString "" -AsPlainText -Force))
$s = New-PSSession -ComputerName "" -Credential $credential
function a(){Get-VM | Where-Object { $_.State -eq "Running" } | Select-Object Name, Uptime | ConvertTo-JSON}
Invoke-Command -Session $s -ScriptBlock ${function:a}
Remove-PSSession $s

# Get Total of free Memory in Gigabytes for host
$credential = New-Object System.Management.Automation.PsCredential("", (ConvertTo-SecureString "" -AsPlainText -Force))
$s = New-PSSession -ComputerName "" -Credential $credential
function a(){$Bytes = Get-Counter -Counter "\Memory\Available Bytes"; $Bytes[0].CounterSamples.CookedValue / 1GB | ConvertTo-JSON}
Invoke-Command -Session $s -ScriptBlock ${function:a}
Remove-PSSession $s

# Get Total of usable Memory in Gigabytes for host
$credential = New-Object System.Management.Automation.PsCredential("", (ConvertTo-SecureString "" -AsPlainText -Force))
$s = New-PSSession -ComputerName "" -Credential $credential
function a(){$vmHost = Get-VMHost; $vmHost.MemoryCapacity / 1GB | ConvertTo-JSON}
Invoke-Command -Session $s -ScriptBlock ${function:a}
Remove-PSSession $s

# Get last LastBootUpTime and LocalDateTime from Host
$credential = New-Object System.Management.Automation.PsCredential("", (ConvertTo-SecureString "" -AsPlainText -Force))
$s = New-PSSession -ComputerName "" -Credential $credential
function a(){Get-CimInstance -ClassName win32_operatingsystem | select LastBootUpTime,LocalDateTime  | ConvertTo-JSON}
Invoke-Command -Session $s -ScriptBlock ${function:a}
Remove-PSSession $s



# Create VHD and mount then init, partition, format, demount
New-VHD -Path $vhdpath -Dynamic -SizeBytes $vhdsize | Mount-VHD -Passthru |Initialize-Disk -Passthru |New-Partition -AssignDriveLetter -UseMaximumSize |Format-Volume -FileSystem NTFS -Confirm:$false -Force;Dismount-VHD -Path $vhdpath
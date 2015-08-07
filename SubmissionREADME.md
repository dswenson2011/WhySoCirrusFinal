#Submission layout
- WhySoCirrusFinal-1.0.0
- SubmissionREADME.md
- Network-Diagram.pdf
- [Final Slides](https://whysocirr.us/finalSlide)
- [Configuration File Skeleton](https://github.com/dswenson2011/WhySoCirrusFinal/blob/c2a8a84c2d69915f66be6cf7a009ea12c2b021a3/lib/configs/config.json)
- [Midterm Slides](http://slides.whysocirr.us/)

---
	The configuration file is located on github as it was never intended to be included
	in the software release due to security issues involving passwords and other secure information
	related to the Active Directory Servers.
	
	Hardware, software, and other core components diagrams are apart of the midterm slides that are linked
	and on the site
	
	The final presentation is made in Sway Microsoft's latest presentation software, there is no
	export ability to Powerpoint although there are imports for powerpoint files. So it is linked to
	on the website and with the link to the correct page listed above.
---
#Project Notes
	Intitially we were going to develop a C# application to act as the REST
	endpoint for Microsoft's Hyper-V but a lack of documentation forced us
	to move towards powershell.
	
	Some wierd aspects from the scripts we utilized with the frontend website
	started to act up upon downloads during development when deploying
	onto new computers but thankfully the initial download for the project
	server had good copies that didn't bring in some odd bugs where like 
	our tables wouldn't display the cell headers.
	
	Another oddity came from transfering the domain from using Google's DNS
	to our own hosted DNS so modifications can happen in a quicker setting
	we learned that glue records are what is used for namserver listng so that
	our nameservers that point to our DNS server can sit on the same domain name
	that we are trying to control.
	
	
#Project Goals
	For the project, we wanted to be able to create, delete and modify base VM’s
	from a web based interface as well as a couple of other things such as creating
	and modifying virtual switches and do basic configuration. We were able to successfully
	set up the web based GUI that could do basic functionality but we hit a couple snags with
	some of the other things. Deletion for instance, we couldn’t implement because the project
	was being hosted in the pool, so that gave you the ability to delete the whole project itself,
	so we left that out. Storage deletion was also left on the backend for similar reasons.
	If you deleted one of the master drives, you would then corrupt everyone else’s VM storage that
	was running off that same OS. The virtual switches worked fine but unfortunately a limitation of
	Hyper-V is that you can only have one physical NIC assigned to one VM, so to be able to set up
	VLAN’s or have one VM have its own direct access was not feasible anymore. Overall we me the goals
	of our project, hitting some snags and limitations of Hyper-V and PowerShell along the way but we
	still managed to put out a nice end product.
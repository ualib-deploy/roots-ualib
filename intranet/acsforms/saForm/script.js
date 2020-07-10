
		// JQuery functions
		$(function() { 	
			// Check to see if any Voyager Access has been requested
			$('.voyager').click(function() {				
				var checkedBoxes = $('.voyager:checked').length;
				
				if(checkedBoxes > 0) {
					$('#voyager_access_requested').val("YES");
				} else {
					$('#voyager_access_requested').val("NO");
				}
				
			});
			
			// Check to see if any Departmental Share Access has been requested
			$('.departmental_share_access').click(function() {				
				var checkedBoxes = $('.departmental_share_access:checked').length;
				
				if(checkedBoxes > 0) {
					$('#departmental_share_access_requested').val("YES");
				} else {
					$('#departmental_share_access_requested').val("NO");
				}
			});	
			
			$('.web_services').click(function() {	
				var webServices = $('.web_services:checked').length;
				
				if(webServices > 0) {
					$('#web_services_requested').val("YES");
				} else {
					$('#web_services_requested').val("NO");
				}
			});
		});

   jQuery(document).ready(function($){

		//Mappings JSON object.  The person maintaining department mappings should use Excel to export a CSV file with departments as the first column and department groups associated with that department in subsequent columns.  

		//A tool like http://www.convertcsv.com/csv-to-json.htm can then be used to get a JSON object from that file.  This definitely isn't the most elegant way to do this -- I may give something like http://papaparse.com/ a try if this list ends up needing to be regenerated often
		

		departmentsToGroups = {
   "A.S. Williams III Americana Collection": {
      "FIELD2": "GROUP-SPECIAL_COLLECTIONS",
      "FIELD3": "GROUP-KBOX-USERS",
      "FIELD4": "GROUP-DIGITAL_PROJECTS",
      "FIELD5": "GROUP-DIGITAL_PROJECTS_RO",
      "FIELD6": "GROUP-WILLIAMS_PRINT",
      "FIELD7": "ALL-LIB",
      "FIELD8": "CollectionDevelopment",
      "FIELD9": "LB-WilliamsCollections-Staff",
      "FIELD10": "LIB-UXAG",
      "FIELD11": "",
      "FIELD12": "",
      "FIELD13": "",
      "FIELD14": "",
      "FIELD15": "",
      "FIELD16": ""
   },
   "Annex Services": {
      "FIELD2": "GROUP-KBOX-USERS",
      "FIELD3": "GROUP-ANNEX",
      "FIELD4": "GROUP-ANNEX01",
      "FIELD5": "GROUP-CIRCULATION",
      "FIELD6": "GROUP-ANNEX_PRINT",
      "FIELD7": "ALL-LIB",
      "FIELD8": "CollectionDevelopment",
      "FIELD9": "LIB-UXAG",
      "FIELD10": "",
      "FIELD11": "",
      "FIELD12": "",
      "FIELD13": "",
      "FIELD14": "",
      "FIELD15": "",
      "FIELD16": ""
   },
   "Area Computing Services": {
      "FIELD2": "GROUP-KBOX-USERS",
      "FIELD3": "WORKSTATION ADMINS",
      "FIELD4": "GROUP-OLT",
      "FIELD5": "GROUP-NETADMIN",
      "FIELD6": "GROUP-HELPDESK",
      "FIELD7": "GROUP-ACS_PRINT",
      "FIELD8": "GROUP-LIBSYS_EMAIL",
      "FIELD9": "OLT",
      "FIELD10": "OLT-ACS-GLOBAL",
      "FIELD11": "OLT-ACS-STAFF",
      "FIELD12": "OLT-ACS-STUDENTS",
      "FIELD13": "",
      "FIELD14": "",
      "FIELD15": "",
      "FIELD16": ""
   },
   "Bruno Business Library": {
      "FIELD2": "GROUP-KBOX-USERS",
      "FIELD3": "GROUP-ERESERVES",
      "FIELD4": "GROUP-3DBRUNO_EMAIL",
      "FIELD5": "GROUP-CALBRUNO_EMAIL",
      "FIELD6": "Circulation Working Discussion Group (CWDG)",
      "FIELD7": "ALL-LIB",
      "FIELD8": "CollectionDevelopment",
      "FIELD9": "LIB-UXAG",
      "FIELD10": "",
      "FIELD11": "",
      "FIELD12": "",
      "FIELD13": "",
      "FIELD14": "",
      "FIELD15": "",
      "FIELD16": ""
   },
   "Business Office": {
      "FIELD2": "GROUP-KBOX-USERS",
      "FIELD3": "GROUP-BUDGET",
      "FIELD4": "GROUP-BUSINESS",
      "FIELD5": "GROUP-ADMINISTRATION",
      "FIELD6": "GROUP-ARLSTATS",
      "FIELD7": "GROUP-HR",
      "FIELD8": "GROUP-ENVIROMENT",
      "FIELD9": "GROUP-BUSINESS_PRINT",
      "FIELD10": "ALL-LIB",
      "FIELD11": "CollectionDevelopment",
      "FIELD12": "LIB-UXAG",
      "FIELD13": "",
      "FIELD14": "",
      "FIELD15": "",
      "FIELD16": ""
   },
   "Circulation Department": {
      "FIELD2": "GROUP-KBOX-USERS",
      "FIELD3": "GROUP-CIRCULATION",
      "FIELD4": "GROUP-ILL",
      "FIELD5": "GROUP-CIRCMAIL_EMAIL",
      "FIELD6": "GROUP-GORGRES_EMAIL",
      "FIELD7": "GROUP-ERESERVES",
      "FIELD8": "GROUP-ILLSTAFF_EMAIL",
      "FIELD9": "GROUP-CIRC_PRINT",
      "FIELD10": "ALL-LIB",
      "FIELD11": "Circulation Working Discussion Group (CWDG)",
      "FIELD12": "CollectionDevelopment",
      "FIELD13": "LIB-UXAG",
      "FIELD14": "RI-CIRC-GLOBAL",
      "FIELD15": "RI-CIRC-STAFF",
      "FIELD16": "RI-CIRC-STUDENTS"
   },
   "Digital Humanities Center": {
      "FIELD2": "GROUP-KBOX-USERS",
      "FIELD3": "GROUP-ADHC",
      "FIELD4": "GROUP-ADHC_PRINT",
      "FIELD5": "ALL-LIB",
      "FIELD6": "CollectionDevelopment",
      "FIELD7": "LIB-UXAG",
      "FIELD8": "",
      "FIELD9": "",
      "FIELD10": "",
      "FIELD11": "",
      "FIELD12": "",
      "FIELD13": "",
      "FIELD14": "",
      "FIELD15": "",
      "FIELD16": ""
   },
   "Digital Services": {
      "FIELD2": "GROUP-KBOX-USERS",
      "FIELD3": "GROUP-DIGITAL_PROJECTS",
      "FIELD4": "GROUP-DIGITAL_PROJECTS_RO",
      "FIELD5": "GROUP-DIGITAL_PRINT",
      "FIELD6": "ALL-LIB",
      "FIELD7": "CollectionDevelopment",
      "FIELD8": "LIB-UXAG",
      "FIELD9": "OLT-DS",
      "FIELD10": "",
      "FIELD11": "",
      "FIELD12": "",
      "FIELD13": "",
      "FIELD14": "",
      "FIELD15": "",
      "FIELD16": ""
   },
   "Gorgas Information Services": {
      "FIELD2": "GROUP-KBOX-USERS",
      "FIELD3": "GROUP-INFORMATION",
      "FIELD4": "GROUP-MUSICLIB_EMAIL",
      "FIELD5": "GROUP-GIS_PRINT",
      "FIELD6": "ALL-LIB",
      "FIELD7": "CollectionDevelopment",
      "FIELD8": "LIB-UXAG",
      "FIELD9": "",
      "FIELD10": "",
      "FIELD11": "",
      "FIELD12": "",
      "FIELD13": "",
      "FIELD14": "",
      "FIELD15": "",
      "FIELD16": ""
   },
   "Assessment & Government Information": {
      "FIELD2": "GROUP-KBOX-USERS",
      "FIELD3": "GROUP-GOV_DOCS",
      "FIELD4": "GROUP-GOVDOCS_PRINT",
      "FIELD5": "ALL-LIB",
      "FIELD6": "CollectionDevelopment",
      "FIELD7": "LIB-UXAG",
      "FIELD8": "LIBINSIGHT",
      "FIELD9": "",
      "FIELD10": "",
      "FIELD11": "",
      "FIELD12": "",
      "FIELD13": "",
      "FIELD14": "",
      "FIELD15": "",
      "FIELD16": ""
   },
   "Hoole Special Collections": {
      "FIELD2": "GROUP-SPECIAL_COLLECTIONS",
      "FIELD3": "GROUP-KBOX-USERS",
      "FIELD4": "GROUP-HOOLEILL_EMAIL",
      "FIELD5": "GROUP-ARCHIVES_DATABASE",
      "FIELD6": "GROUP-ARCHIVES-EMAIL",
      "FIELD7": "GROUP-HOOLE_PRINT",
      "FIELD8": "ALL-LIB",
      "FIELD9": "Circulation Working Discussion Group (CWDG)",
      "FIELD10": "CollectionDevelopment",
      "FIELD11": "HL-SPECIALCOLLECTIONS",
      "FIELD12": "LIB-GUEST-EZPROXY",
      "FIELD13": "LIB-UXAG",
      "FIELD14": "",
      "FIELD15": "",
      "FIELD16": ""
   },
   "Institutional Repository Services": {
      "FIELD2": "GROUP-KBOX-USERS",
      "FIELD3": "GROUP-IRANNEX",
      "FIELD4": "GROUP-IR_EMAIL",
      "FIELD5": "GROUP-IR_PRINT",
      "FIELD6": "ALL-LIB",
      "FIELD7": "CollectionDevelopment",
      "FIELD8": "LIB-UXAG",
      "FIELD9": "",
      "FIELD10": "",
      "FIELD11": "",
      "FIELD12": "",
      "FIELD13": "",
      "FIELD14": "",
      "FIELD15": "",
      "FIELD16": ""
   },
   "Interlibrary Loan": {
      "FIELD2": "GROUP-KBOX-USERS",
      "FIELD3": "GROUP-ILL",
      "FIELD4": "GROUP-ILLSTAFF_EMAIL",
      "FIELD5": "GROUP-CIRCULATION",
      "FIELD6": "GROUP-ERESERVES",
      "FIELD7": "GROUP-CIRCMAIL_EMAIL",
      "FIELD8": "GROUP-GORGRES_EMAIL",
      "FIELD9": "ALL-LIB",
      "FIELD10": "CollectionDevelopment",
      "FIELD11": "LIB-UXAG",
      "FIELD12": "GROUP-CIRC_PRINT",
      "FIELD13": "",
      "FIELD14": "",
      "FIELD15": "",
      "FIELD16": ""
   },
   "Library Administration": {
      "FIELD2": "GROUP-KBOX-USERS",
      "FIELD3": "GROUP-DEAN",
      "FIELD4": "GROUP-DEAN&SEC",
      "FIELD5": "GROUP-ARLSTATS",
      "FIELD6": "GROUP-ASSESSMENT",
      "FIELD7": "GROUP-BUDGET",
      "FIELD8": "GROUP-ADMINISTRATION",
      "FIELD9": "GROUP-DIGIHUM",
      "FIELD10": "GROUP-INFOLIT",
      "FIELD11": "GROUP-ADMIN_PRINT",
      "FIELD12": "ALL-LIB",
      "FIELD13": "CollectionDevelopment",
      "FIELD14": "Hathitrust",
      "FIELD15": "LIB-UXAG",
      "FIELD16": ""
   },
   "McLure Education Library": {
      "FIELD2": "GROUP-KBOX-USERS",
      "FIELD3": "GROUP-EDUCATION",
      "FIELD4": "GROUP-MCLUREILL_EMAIL",
      "FIELD5": "GROUP-MCLURELIB_EMAIL",
      "FIELD6": "GROUP-3DMCLURE_EMAIL",
      "FIELD7": "GROUP-CALMCLURE_EMAIL",
      "FIELD8": "GROUP-EDUCATION_PRINT",
      "FIELD9": "ALL-LIB",
      "FIELD10": "Circulation Working Discussion Group (CWDG)",
      "FIELD11": "LIB-UXAG",
      "FIELD12": "",
      "FIELD13": "",
      "FIELD14": "",
      "FIELD15": "",
      "FIELD16": ""
   },
   "Digital Services": {
      "FIELD2": "GROUP-KBOX-USERS",
      "FIELD3": "GROUP-DIGITAL_PROJECTS",
      "FIELD4": "GROUP-DIGITAL_PROJECTS_RO",
      "FIELD5": "GROUP-SPECIAL_COLLECTIONS",
      "FIELD6": "GROUP-DIGITAL_PRINT",
      "FIELD7": "ALL-LIB",
      "FIELD8": "CollectionDevelopment",
      "FIELD9": "LIB-UXAG",
      "FIELD10": "OLT-DS",
      "FIELD11": "",
      "FIELD12": "",
      "FIELD13": "",
      "FIELD14": "",
      "FIELD15": "",
      "FIELD16": ""
   },
   "Resource Acquisitions & Discovery": {
      "FIELD2": "GROUP-KBOX-USERS",
      "FIELD3": "GROUP-CATALOGING",
      "FIELD4": "GROUP-ACQUISITIONS",
      "FIELD5": "GROUP-ERESOURCES",
      "FIELD6": "GROUP-ERM-LICENSES",
      "FIELD7": "GROUP-METADATA",
      "FIELD8": "GROUP-LIBRARYACQ_EMAIL",
      "FIELD9": "GROUP-RUSHCATS_EMAIL",
      "FIELD10": "GROUP-CATALOG_DEPT_EMAIL",
      "FIELD11": "GROUP-RAD_PRINT",
      "FIELD12": "ALL-LIB",
      "FIELD13": "CollectionDevelopment",
      "FIELD14": "LIB-UXAG",
      "FIELD15": "OLT-ERES",
      "FIELD16": "Resource-Acquisitions-Discovery"
   },
   "Rodgers Library for Science and Engineering": {
      "FIELD2": "GROUP-KBOX-USERS",
      "FIELD3": "GROUP-SCIENCE_ENGINEERING",
      "FIELD4": "GROUP-SELILL_EMAIL",
      "FIELD5": "GROUP-3DRODGERS_EMAIL",
      "FIELD6": "GROUP-CALRODGERS_EMAIL",
      "FIELD7": "GROUP-SCENGLIB_EMAIL",
      "FIELD8": "GROUP-SCI_PRINT",
      "FIELD9": "ALL-LIB",
      "FIELD10": "CollectionDevelopment",
      "FIELD11": "LIB-UXAG",
      "FIELD12": "RL-CIRC-STAFF",
      "FIELD13": "",
      "FIELD14": "",
      "FIELD15": "",
      "FIELD16": ""
   },
   "Sanford Media Center": {
      "FIELD2": "GROUP-KBOX-USERS",
      "FIELD3": "GROUP-MEDIA_SERVICES",
      "FIELD4": "GROUP-SMC_EMAIL",
      "FIELD5": "GROUP-SMC_PRINT",
      "FIELD6": "ALL-LIB",
      "FIELD7": "CollectionDevelopment",
      "FIELD8": "LIB-UXAG",
      "FIELD9": "SMC-STAFF",
      "FIELD10": "",
      "FIELD11": "",
      "FIELD12": "",
      "FIELD13": "",
      "FIELD14": "",
      "FIELD15": "",
      "FIELD16": ""
   },
   "Web Technologies and Development": {
      "FIELD2": "GROUP-KBOX-USERS",
      "FIELD3": "GROUP-WEBDEV_EMAIL",
      "FIELD4": "GROUP-OLT",
      "FIELD5": "GROUP-GOTS-EMAIL",
      "FIELD6": "GROUP-WEB_SERVICES",
      "FIELD7": "GROUP-WEBDEV_PRINT",
      "FIELD8": "ALL-LIB",
      "FIELD9": "CollectionDevelopment",
      "FIELD10": "LIB-UXAG",
      "FIELD11": "OLT-WEB",
      "FIELD12": "OLT-WID",
      "FIELD13": "",
      "FIELD14": "",
      "FIELD15": "",
      "FIELD16": ""
   }
}


		//Field 8 is the departmental dropdown
		$('#field8').change(function(obj){
		   

			//Get the selected department
			var department = $("select option:selected" )[0].textContent;

			//Uncheck currently checked departmental boxes
			$('#collapse4 .checkbox input:checked').each(function(){
			    this.checked = false;
			});
			
			//Uncheck currently checked email distribution groups
			$('#collapse5 .checkbox input:checked').each(function(){
			    this.checked = false;
			});


			//Get groups to add from overly large array above
			var groupsToAdd = departmentsToGroups[department];

			//Declare array groups will be added to
			var groupsToAddArray = [];


			//Get groups to add from overly large array above
			Object.keys(groupsToAdd).forEach(function(key){
			  if (groupsToAdd[key] != ''){
			  	groupsToAddArray.push(groupsToAdd[key]);
		  	  }
			});

			for (i = 0; i < groupsToAddArray.length; i++){

			  //Process group name for comparison with value in HTML -- alternatively, the HTML values could be changed to match the groups.
			  var currentGroupName = groupsToAddArray[i];
				if (currentGroupName.slice(0,5) == 'GROUP'){
					var currentGroupName = currentGroupName.trim();
					var currentGroupName = currentGroupName.slice(6);
					var currentGroupName = currentGroupName.replace(/-/g, ' ');
					var currentGroupName = currentGroupName.replace(/_/g, ' ');		
				}
				

			  //Build selector for checkbox
			  var selector = 'input[value="' + currentGroupName + '"]';

			  //Debugging
			  //console.log(selector);

			  //Check selected box 
			  $(selector).each(function(){
			    this.checked = true; 
			  });
			}
			
			  // Check to see if any Voyager Access has been requested (it's not triggered by a departmental selection, so it shouldn't be).  
				var checkedBoxes = $('.voyager:checked').length;
			
				if(checkedBoxes > 0) {
					$('#voyager_access_requested').val("YES");
				} else {
					$('#voyager_access_requested').val("NO");
				}
				
				// Check to see if any Departmental Share Access has been requested
				var checkedBoxes = $('.departmental_share_access:checked').length;
				
				if(checkedBoxes > 0) {
					$('#departmental_share_access_requested').val("YES");
				} else {
					$('#departmental_share_access_requested').val("NO");
				}
				
				// Check to see if any Web Services Access has been requested
				var webServices = $('.web_services:checked').length;
				
				if(webServices > 0) {
					$('#web_services_requested').val("YES");
				} else {
					$('#web_services_requested').val("NO");
				}

		});
		
		//Autofill AD telephone and email based on name selection
		$('#AssociateDean').change(function(obj){
			
					if ($(this).val() == 'Tom Wilson'){
						$('#AssociateDeanPhone').val('2299');
						$('#AssociateDeanEmail').val('tcwilson@ua.edu');
					}
					if ($(this).val() == 'Millie Jackson'){
						$('#AssociateDeanPhone').val('5008');
						$('#AssociateDeanEmail').val('mljackson@ua.edu');
					}
					if ($(this).val() == 'Lorraine Madway'){
						$('#AssociateDeanPhone').val('0513');
						$('#AssociateDeanEmail').val('lmadway@ua.edu');
					}
					if ($(this).val() == 'Emily Decker'){
						$('#AssociateDeanPhone').val('3497');
						$('#AssociateDeanEmail').val('endecker@ua.edu');
					}
				});
				
		 //Hide AD row when student is selected for employee type, show it when faculty/staff is selected
			$('input[name="OBKey_Employee_Type_1"]').change(function(obj){
			   console.log("change!");
				 var employeeTypeValue = $(this).val(); 
				 //console.log("this val is " + employeeTypeValue);
				if (employeeTypeValue == 'STUDENT/GTA/INTERN'){
					$('#AssociateDean').val('');
					$('#AssociateDeanPhone').val('');
					$('#AssociateDeanEmail').val('');
					$('#AssociateDean').removeAttr('required');
					$('#AssociateDeanPhone').removeAttr('required');
					$('#AssociateDeanEmail').removeAttr('required');
					$('#ADRow').hide();
				}
				else {
					$('#ADRow').show();				
					$('#AssociateDean').prop('required', true);
					$('#AssociateDeanPhone').prop('required', true);
					$('#AssociateDeanEmail').prop('required', true);					
				}
			});

    });

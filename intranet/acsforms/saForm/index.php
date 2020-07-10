<!--
// TODO
// 1. comment out everything that ins't part of the form
// 2. move scripts to separate file
// 3. add conditional to content-page.php
// 4. test!

    
    <link rel="stylesheet" type="text/css" href="stylesheet.css">     
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
	<script type='text/javascript' src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>
    <script type='text/javascript' src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
-->
		<div class="container">
			<img src="https://imageweb.ua-net.ua.edu/AppNet/images/librariesk_black.png" alt="UA Libraries Logo" style="width:150px;height:60px">
            <!--
               OBTEST: https://imageweb-test.ua-net.ua.edu/AppNet/images/librariesk_black.png
               OBPROD: https://imageweb.ua-net.ua.edu/AppNet/images/librariesk_black.png
            -->
				<h1 class="h2">Security Authorization Form</h1>
				<h2 class="h3">Network & Voyager Access</h2>
         <hr>
		
			<form name="form" action="https://imageweb.ua-net.ua.edu/Public/LoginFormProc.aspx?FromLoginFormProc=true" method="post">
            <!--
               OBTEST: https://imageweb-test.ua-net.ua.edu/Public/LoginFormProc.aspx?FromLoginFormProc=true
               OBPROD: https://imageweb.ua-net.ua.edu/Public/LoginFormProc.aspx?FromLoginFormProc=true
            -->
			
				<!-- Begin Required OnBase Fields -->
				<div id="loginformprocparams"> 
					<input type="hidden" name="LanguageParam" value="en-us" />
					<input type="hidden" name="OBWeb_FinalTargetPage" value="https://intranet.lib.ua.edu/acsforms/saForm/landing.html"/>
					<input type="hidden" name="OBDocumentType" value="884" /><!-- OBTEST: 755 OBPROD: 884 -->
					<input type="hidden" name="OBWeb_Redirect" value="https://intranet.lib.ua.edu/acsforms/saForm/landing.html"/>
				</div>
				<input type="hidden" id="voyager_access_requested" name="OBKey_UL_Voyager_Access_Requested_1" value="NO" />
				<input type="hidden" id="departmental_share_access_requested" name="OBKey_UL_Departmental_Share_Access_Requested_1" value="NO" />
				<input type="hidden" id="web_services_requested" name="OBKey_UL_Web_Services_Requested_1" value="NO" />
				<!-- End Required OnBase Fields -->
				
				<div class="row">
						<div class="col-md-4">
							<fieldset class="form-group">
								<label for="field1">
									Effective Date: 
								</label>
								<input required type="date" class="form-control" name="OBKey_Effective_Date_1" id="field1">
							</fieldset>
						</div>
					</div>
		
					<div class="row">
								<p style="font-weight:700; padding-left: 15px;">Request Type</p>
						<div class="col-md-2">
							<fieldset class="form-group">
								<label class="radio-inline">
									<input required type="radio" name="OBKey_Request_Type_1" value="Add Employee">
									Add new employee
								</label>
							</fieldset>
						</div>
						<div class="col-md-4">
							<fieldset class="form-group">
								<label class="radio-inline">
									<input type="radio" name="OBKey_Request_Type_1" value="Change Info">
									Change to info/requirements of existing account
								</label>
							</fieldset>
						</div>
						<div class="col-md-4">
							<fieldset class="form-group">
								<label class="radio-inline">
									<input type="radio" name="OBKey_Request_Type_1" value="Transfer">
									Transfer to another dept within the libraries
								</label>
							</fieldset>
						</div>
					</div>
					
					<div class="row">
						<div class="col-md-7">
							<fieldset class="form-group">
								<label for="field2">
									Employee Name (First Middle Last)
								</label>
									<input required type="text" class="form-control" name="OBKey_Employee_Name_1" id="field2" >
							</fieldset>
						</div>
						<div class="col-md-5">
							<fieldset class="form-group">
								<label for="field3">
									Current User ID (for existing users) <em>NOT CWID</em>
								</label>
									<input type="text" class="form-control" name="OBKey_UL_User_ID_1" id="field3">
							</fieldset>
						</div>
					</div>
					
					<div class="row">
						<div class="col-md-4">
							<fieldset class="form-group">
								<label for="field4">
									Position Title
								</label>
									<input required type="text" class="form-control" name="OBKey_Position_Title_1" id="field4">
							</fieldset>
						</div>
						<div class="col-md-3">
							<fieldset class="form-group">
								<label for="field5">
									Work Telephone (last 4 digits) 
								</label>
									<input required type="text" class="form-control" name="OBKey_Office_Phone_1" id="field5">
							</fieldset>
						</div>	
						<div class="col-md-5">
							<fieldset class="form-group">
								<label for="field6">
									Email Address <small>(enter an address the user currently has access to)</small>

								</label>
									<input required type="email" class="form-control" name="OBKey_Employee_Email_1" id="field6">
							</fieldset>
						</div>	
					</div>	
					
					<div class="row">
						<div class="col-md-2">
							<fieldset class="form-group">
								<label for="field7">
									Office Room Number
								</label>
									<input required type="text" class="form-control" name="OBKey_Room_Number_1" id="field7">
							</fieldset>
						</div>	
						<div class="col-md-3">
							<fieldset class="form-group">
								<label for="field8">
									Department
								</label>
									<select required class="form-control" name="OBKey_Department_1" id="field8">
									<option value="" disabled selected hidden>Choose A Department</option>
									<option value="williams">A.S. Williams III Americana Collection</option>
									<option value="annex">Annex Services</option>
									<option value="acs">Area Computing Services</option>
									<option value="govdocs">Assessment & Government Information</option>
									<option value="bruno">Bruno Business Library</option>
									<option value="businessoffice">Business Office</option>
									<option value="circulation">Circulation Department</option>
									<option value="dhc">Digital Humanities Center</option>
									<option value="digitalservices">Digital Services</option>
									<option value="gis">Gorgas Information Services</option>
									<option value="hoole">Hoole Special Collections</option>
									<option value="ir">Institutional Repository Services</option>
									<option value="ill">Interlibrary Loan</option>
									<option value="libadmin">Library Administration</option>
									<option value="mclure">McLure Education Library</option>
									<option value="acquisitions">Resource Acquisitions &amp; Discovery</option>
									<option value="rodgers">Rodgers Library for Science and Engineering</option>
									<option value="smc">Sanford Media Center</option>
									<option value="webservices">Web Technologies and Development</option>
									</select>
							</fieldset>
						</div>	
				
		
						<div class="col-md-3">
							<p id="employeeType" style="font-weight:700;">Employee Type</p>
							<div class="row">
								<div class="col-md-4">
									<fieldset class="form-group">
										<label class="radio-inline">
											<input required type="radio" name="OBKey_Employee_Type_1" value="FACULTY/PROFESSIONAL">
											Faculty
										</label>
									</fieldset>
								</div>
								<div class="col-md-4">
									<fieldset class="form-group">
										<label class="radio-inline">
											<input type="radio" name="OBKey_Employee_Type_1" value="STAFF">
											Staff 
										</label>
									</fieldset>
								</div>
								<div class="col-md-4">
									<fieldset class="form-group">
										<label class="radio-inline">
											<input type="radio" name="OBKey_Employee_Type_1" value="STUDENT/GTA/INTERN">
											Student
										</label>
									</fieldset>
								</div>
							</div>	
						</div>
					</div>
					
					<div class="row">	
						<div class="col-md-4">
							<fieldset class="form-group">
								<label for="field13">
									Submitter
								</label>
								<input required type="text" class="form-control" name="OBKey_Submitter_1" id="field13">
							</fieldset>
						</div>
						<div class="col-md-3">
							<fieldset class="form-group">
								<label for="field14">
									Submitter's Telephone (last 4 digits)
								</label>
								<input required type="text" class="form-control" name="OBKey_Submitters_Phone_Number_1" id="field14">
							</fieldset>
						</div>
						<div class="col-md-5">
							<fieldset class="form-group">
								<label for="field15">
									Submitter's Email
								</label>
								<input required type="email" class="form-control" name="OBKey_Submitters_Email_1" id="field15">
							</fieldset>
						</div>	
					</div>
					
					<div class="row" id="ADRow">						
						<div class="col-md-4">
							<fieldset class="form-group">
								<label for="AssociateDean">
									Associate Dean
								</label>
								<select required class="form-control" name="OBKey_Associate_Dean_Name_1" id="AssociateDean">
								  <option selected></option>
									<option>Tom Wilson</option>
									<option>Millie Jackson</option>
									<option>Lorraine Madway</option>
									<option>Emily Decker</option>
								</select>
							</fieldset>
						</div>
						<div class="col-md-3">
							<fieldset class="form-group">
								<label for="AssociateDeanPhone">
									Associate Dean's Telephone (last 4 digits)
								</label>
								<input type="text" class="form-control" name="OBKey_Associate_Dean_Phone_1" id="AssociateDeanPhone">
							</fieldset>
						</div>
						<div class="col-md-5">
							<fieldset class="form-group">
								<label for="AssociateDeanEmail">
									Associate Dean's Email
								</label>
								<input type="email" class="form-control" name="OBKey_Associate_Dean_Email_1" id="AssociateDeanEmail">
							</fieldset>
						</div>	
					</div>
					
					
						<h2>Account Access</h2>
							<p>Please note: Voyager Profiles-One selection is required for each module. <em>Access will only be given for selected items.</em> If no selections are made, the form may be sent back.</p>
							<p>Descriptions of the various profiles are <a href="https://intranet.lib.ua.edu/olt/resources">on the intranet</a>.</p>
		
<div class="panel-group" id="accordion">
<!--first panel-->
	<div class="panel panel-default">
	    <div class="panel-heading">
			<h4 class="panel-title">
			    <a data-toggle="collapse" data-parent="#accordion" href="#collapse1">A1. Acquisitions Profiles</a>
			</h4>
		</div>  
		<div id="collapse1" class="panel-collapse collapse">
			<div class="panel-body">
			  	<div class="form-group">
					<div class="checkbox">
					<label>
			        <input type="checkbox" class="voyager" name="OBKey_UL_Acquisitions_Profiles_1" value="Acq - HS - Comb">
				    Acq - HS - Comb
					</label>
					</div>	
				    <div class="checkbox"> 
					<label>
			        <input type="checkbox" class="voyager" name="OBKey_UL_Acquisitions_Profiles_2" value="Acq - HS - Ser"> 
				    Acq - HS - Ser
					</label>	
					</div>  
					<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Acquisitions_Profiles_3" value="Acq - Ser - kr "> 
					Acq - Ser - kr 
					</label>
					</div>
					<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Acquisitions_Profiles_4" value="AcqStu">
					AcqStu 
					</label>
					</div>
					<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Acquisitions_Profiles_5" value="Acquisitions - Mono2">	
					Acquisitions - Mono2
					</label>
					</div>	
					<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Acquisitions_Profiles_6" value="Acquisitions - Monographs">
					Acquisitions - Monographs 
					</label>
					</div>
					<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Acquisitions_Profiles_7" value="Acquisitions - Serials">
					Acquisitions - Serials
					</label>
					</div>
					<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Acquisitions_Profiles_8" value="Acquisitions Supervisor">
					Acquisitions Supervisor 
					</label>
					</div>
					<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Acquisitions_Profiles_9" value="Acquisitions - PromptCat">
					Acquisitions - PromptCat
					</label>
					</div>
					<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Acquisitions_Profiles_10" value="Business Office I">
					Business Office I 
					</label>
					</div>
					<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Acquisitions_Profiles_11" value="Business Office II">
					Business Office II 
					</label>
					</div>
					<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Acquisitions_Profiles_12" value="Selector/Binding">
					Selector/Binding
					</label>
					</div>
				</div>	
			</div>	
		</div>	
	</div>	
<!--second panel-->
	<div class="panel panel-default">
		<div class="panel-heading">
			<h4 class="panel-title">
				<a data-toggle="collapse" data-parent="#accordion" href="#collapse2">A2. Cataloging Profiles</a>
				</h4>
		</div>
		<div id="collapse2" class="panel-collapse collapse"> 
			<div class="panel-body"> 
				<div class="form-group">
					<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Cataloging_Profiles_1" value="AcqCat">
					AcqCat
					</label>
					</div>	
					<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Cataloging_Profiles_2" value="CatViewOnly">
					CatViewOnly
					</label> 
					</div>
					<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Cataloging_Profiles_3" value="Catalog Assistant I">
					Catalog Assistant I
					</label>
					</div>
					<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Cataloging_Profiles_4" value="Catalog Assistant II">
					Catalog Assistant II 
					</label>
					</div> 
					<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Cataloging_Profiles_5" value="Catalog External">
					Catalog External
					</label>
					</div>	
					<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Cataloging_Profiles_6" value="Catalog Supervisor">
					Catalog Supervisor
					</label>
					</div>
					<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Cataloging_Profiles_6" value="Catalog Supervisor II">
					Catalog Supervisor II
					</label>
					</div>
					<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Cataloging_Profiles_7" value="Copy Catalog">
					Copy Catalog
					</label>
					</div>
					<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Cataloging_Profiles_8" value="Copy Catalog GPO">
					Copy Catalog GPO 
					</label>
					</div>	
					<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Cataloging_Profiles_9" value="HS Catalog">
					HS Catalog
					</label>
					</div>
					<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Cataloging_Profiles_9" value="HS Catalog Assistant">
					HS Catalog Assistant
					</label>
					</div>
					<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Cataloging_Profiles_10" value="HSL Cataloging">
					HSL Cataloging
					</label>
					</div>
					<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Cataloging_Profiles_11" value="Reserves">
					Reserves
					</label>
					</div>	
					<div class="checkbox">
					<label> 
					<input type="checkbox" class="voyager" name="OBKey_UL_Cataloging_Profiles_12" value="Student GPO">
					Student GPO 
					</label>
					</div>
				</div>
			</div>
		</div>
	</div>
<!--third panel-->
	<div class="panel panel-default">
		<div class="panel-heading">
			<h4 class="panel-title">
		    	<a data-toggle="collapse" data-parent="#accordion" href="#collapse3">A3. Circulation Profiles</a>
				</h4>
		</div>
		<div id="collapse3" class="panel-collapse collapse">
			<div class="panel-body">
				<div class="form-group">
				
				<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Circulation_Profiles_1" value="CircCat">
					CircCat
					</label>
				</div>
				<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Circulation_Profiles_2" value="CircOperSpecColl">
					CircOperSpecColl
					</label>
				</div>
				<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Circulation_Profiles_3" value="CircOperWPatronEdit">
					CircOperW/Patron_Edit_tmp
					</label>
				</div>
				<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Circulation_Profiles_4" value="CircOper">
					CircOperator
					</label>
				</div>
				<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Circulation_Profiles_5" value="CircOperPlus">
					CircOperatorPlus</label>
				</div>
				<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Circulation_Profiles_6" value="CircPatronViewOnly">
					CircPatronViewOnly
					</label>
				</div>
				<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Circulation_Profiles_7" value="CircSelector/Acq Gifts">
					CircSelector/Acq Gifts
					</label>
				</div>	
				<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Circulation_Profiles_8" value="CircSupervisor">
					CircSupervisor
					</label>
				</div>	
				<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Circulation_Profiles_9" value="CircSuperSSN">
					CircSupervisorSSN
					</label>
				</div>	
				<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Circulation_Profiles_10" value="CircReserve">
					CircWithReserve
					</label>
				</div>
				<div class="checkbox"> 
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Circulation_Profiles_11" value="HS Circ">
					HS Circ
					</label>
				</div>
				<div class="checkbox"> 
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Circulation_Profiles_12" value="HS Circ Operator">
					HS Circ Operator
					</label>
				</div>
				<div class="checkbox">				
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Circulation_Profiles_13" value="HS Circ/Res">
					HS Circ/Res
					</label>
				</div>
				<div class="checkbox"> 
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Circulation_Profiles_14" value="Media Center Students">
					Media Center Students
					</label>
				</div>
				<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Circulation_Profiles_15" value="Selfchk"> 
					Selfchk
					</label>
				</div>
				<div class="checkbox"> 
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Circulation_Profiles_16" value="WRCStaff">
					WRCStaff	
					</label>
				</div>
				<div class="checkbox">
					<label>
					<input type="checkbox" class="voyager" name="OBKey_UL_Circulation_Profiles_17" value="WRCStudent">
					WRCStudent
					</label>
				</div>
			  </div>
          	</div>			
	  	</div>
   	</div>
<!--fourth panel-->
	<div class="panel panel-default">
	    <div class="panel-heading">
			<h4 class="panel-title">
			    <a data-toggle="collapse" data-parent="#accordion" href="#collapse4">B. Departmental Share and Print Access <small>  (Choose all that apply)</small></a>
			</h4>
		</div>  
		<div id="collapse4" class="panel-collapse collapse">
			<div class="panel-body">
				<div class="form-group">
					<div class="row">				
						<div class="col-md-3">
				
				<div class="checkbox"> 
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_1" value="ACADEMIC LABS" />
								ACADEMIC LABS
								</label>
						    </div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_2" value="ACQUISITIONS" />
								ACQUISITIONS
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_57" value="ACS PRINT" />
								ACS PRINT
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_3" value="ADHC" />
								ADHC
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_58" value="ADHC PRINT" />
								ADHC PRINT
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_4" value="ADMINISTRATION" />
								ADMINISTRATION
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_59" value="ADMIN PRINT" />
								ADMIN PRINT
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_5" value="ANNEX" />
								ANNEX
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_6" value="ANNEX01" />
								ANNEX01
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_60" value="ANNEX PRINT" />
								ANNEX PRINT
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_7" value="ARCHIVES DATABASE" />
								ARCHIVES DATABASE
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_8" value="ARLSTATS" />
								ARLSTATS
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_9" value="ASSESSMENT" />
								ASSESSMENT
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_62" value="CALBRUNO EMAIL" />
								BRUNO CALENDAR
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_10" value="BUDGET" />
								BUDGET
								</label>
							</div>	
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_11" value="BUSINESS" />
								BUSINESS
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_63" value="BUSINESS PRINT" />
								BUSINESS PRINT
								</label>
							</div>
						</div>	
						
						<div class="col-md-3">
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_12" value="CATALOGING" />
								CATALOGING
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_14" value="CIRCULATION" />
								CIRCULATION
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_64" value="CIRC PRINT" />
								CIRC PRINT
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_15" value="DEAN" />
								DEAN
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_16" value="DEAN&SEC" />
								DEAN&SEC
								</label>
							</div>

							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_17" value="DIGIHUM" />
								DIGIHUM
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_65" value="DIGITAL PRINT" />
								DIGITAL PRINT
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_18" value="DIGITAL PROJECTS" />
								DIGITAL PROJECTS
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_19" value="DIGITAL PROJECTS RO" />
								DIGITAL PROJECTS RO
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_20" value="EDUCATION" />
								EDUCATION
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_66" value="EDUCATION PRINT" />
								EDUCATION PRINT
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_21" value="ENVIROMENT" />
								ENVIRONMENT
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_22" value="ERESERVES" />
								ERESERVES
								</label>
							</div>
							<div class="checkbox">
								<label>	
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_23" value="ERESOURCES" />
								ERESOURCES
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_24" value="ERM LICENSES" />
								ERM-LICENSES
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_67" value="GIS PRINT" />
								GIS PRINT
								</label>
							</div>
						</div>
					
						<div class="col-md-3">
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_27" value="GOV DOCS" />
								GOV DOCS
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_68" value="GOVDOCS PRINT" />
								GOV DOCS PRINT
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_28" value="HELPDESK" />
								HELP DESK
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_69" value="HOOLE PRINT" />
								HOOLE PRINT
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_30" value="HR" />
								HR
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_31" value="ILL" />
								ILL
								</label>
							</div>	

							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_33" value="INFOLIT" />
								INFOLIT
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_34" value="INFORMATION" />
								INFORMATION
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_70" value="IRANNEX" />
								IR ANNEX
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_71" value="IR PRINT" />
								IR PRINT
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_35" value="JSTOR" />
								JSTOR
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_36" value="KBOX USERS" />
								KBOX USERS
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_37" value="LIBNAS1 RW ACCESS" />
								LIBNAS1 RW ACCESS
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_85" value="LIBINSIGHT" />
								LIBINSIGHT
								</label>
							</div>

							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_42" value="MEDIA SERVICES" />
								MEDIA SERVICES
								</label>
							</div>			
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_43" value="METADATA" />
								METADATA
								</label>
							</div>				
						</div>	
					
						<div class="col-md-3">
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_86" value="NDNP PROJECT" />
								NDNP PROJECT
								</label>
							</div>				
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_83" value="NETADMIN" />
								NETADMIN
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_45" value="OLT" />
								OLT
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_75" value="RAD PRINT" />
								RAD PRINT
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_47" value="SCIENCE ENGINEERING" />
								SCIENCE ENGINEERING
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_81" value="SCI PRINT" />
								SCIENCE PRINT
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_78" value="SMC PRINT" />
								SMC PRINT
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_50" value="SPECIAL COLLECTIONS" />
								SPECIAL COLLECTIONS
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="web_services" name="OBKey_UL_Departmental_Share_Access_51" value="WEB SERVICES" />
								WEB SERVICES
								</label>
							</div>	
							<div class="checkbox">
								<label>
								<input type="checkbox" class="web_services" name="OBKey_UL_Departmental_Share_Access_52" value="WEB LIBGUIDES" />
								WEB LIBGUIDES
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="web_services" name="OBKey_UL_Departmental_Share_Access_53" value="WEB LIBANSWERS" />
								WEB LIBANSWERS
								</label>
              </div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="web_services" name="OBKey_UL_Departmental_Share_Access_54" value="WEB LIBCAL" />
								WEB LIBCAL 
								</label>
							</div>
							<div class="checkbox">	
								<label>
								<input type="checkbox" class="web_services" name="OBKey_UL_Departmental_Share_Access_79" value="WEBDEV PRINT" />
								WEBDEV PRINT
								</label>
							</div>
							<div class="checkbox">	
								<label>
								<input type="checkbox" class="web_services" name="OBKey_UL_Departmental_Share_Access_80" value="WILLIAMS PRINT" />
								WILLIAMS PRINT
								</label>
							</div>
							<div class="checkbox">	
								<label>
								<input type="checkbox" class="departmental_share_acces" name="OBKey_UL_Departmental_Share_Access_84" value="WORKSTATION ADMINS" />
								WORKSTATION ADMINS
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_56" value="OTHER" />Other
								</label>
								<label>
								<input type="text" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_Other_1" />
								</label>
							</div>	
				
				
				
				
						</div>
					</div>
				</div>	
			</div>
		</div>
	</div>
<!--fifth panel-->
	<div class="panel panel-default">
		<div class="panel-heading">
			<h4 class="panel-title">
				<a data-toggle="collapse" data-parent="#accordion" href="#collapse5">C. Departmental Email and Email Distribution Groups <small>(Choose all that apply)</small></a>
			</h4>
		</div>
		<div id="collapse5" class="panel-collapse collapse">
			<div class="panel-body">
				<div class="row">
					<div class="form-group">
						<div class="col-md-6" id="email-left-col">
							<div class="checkbox"> 
								<label>
								<input type="checkbox" class="email_distribution_groups" name="OBKey_UL_Email_Distribution_Groups_1" value="ALL-LIB">
									ALL-LIB
								</label>
              </div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_61" value="3DBRUNO EMAIL" />
								BRUNO 3D PRINTING EMAIL
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_13" value="CIRCMAIL EMAIL" />
								CIRCMAIL EMAIL
								</label>
							</div>
							<div class="checkbox"> 
								<label>
								<input type="checkbox" class="email_distribution_groups" name="OBKey_UL_Email_Distribution_Groups_2" value="WDG">
									Circulation Working Discussion Group (CWDG)
								</label>
				    		</div>									
							<div class="checkbox"> 
								<label>
								<input type="checkbox" class="email_distribution_groups" name="OBKey_UL_Email_Distribution_Groups_3" value="CollectionDevelopment">
										Collection Development
									</label>
				    		</div>					    		
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_25" value="GORGRES EMAIL" />
								GORGRES EMAIL
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_26" value="GOTS EMAIL" />
								GOTS EMAIL
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="email_distribution_groups" name="OBKey_UL_Email_Distribution_Groups_24" value="ARCHIVES EMAIL" />
								ARCHIVES EMAIL
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="email_distribution_groups" name="OBKey_UL_Email_Distribution_Groups_25" value="CATALOG DEPT EMAIL" />
								CATALOG DEPT EMAIL
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="email_distribution_groups" name="OBKey_UL_Email_Distribution_Groups_26" value="SCENGLIB EMAIL" />
								SCENGLIB EMAIL
								</label>
							</div>
							<div class="checkbox"> 
								<label>
								<input type="checkbox" class="email_distribution_groups" name="OBKey_UL_Email_Distribution_Groups_4" value="Hathitrust">
									Hathitrust Request
								</label>
				    		</div>
							<div class="checkbox"> 
								<label>
								<input type="checkbox" class="email_distribution_groups" name="OBKey_UL_Email_Distribution_Groups_5" value="HL-SPECIALCOLLECTIONS">
									HL-SPECIALCOLLECTIONS
								</label>
				    		</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_29" value="HOOLEILL EMAIL" />
								HOOLEILL EMAIL 
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_32" value="ILLSTAFF EMAIL" />
								ILL STAFF EMAIL 
								</label>
							</div>
							<div class="checkbox"> 
								<label>
								<input type="checkbox" class="email_distribution_groups" name="OBKey_UL_Email_Distribution_Groups_6" value="LB-WilliamsCollections-Staff">
									LB-WilliamsCollections-Staff
								</label>
				    		</div>
							<div class="checkbox"> 
								<label>
								<input type="checkbox" class="email_distribution_groups" name="OBKey_UL_Email_Distribution_Groups_27" value="LIB-GUEST-EZProxy">
									LIB-GUEST-EZProxy
								</label>
				    		</div>
							<div class="checkbox"> 
								<label>
								<input type="checkbox" class="email_distribution_groups" name="OBKey_UL_Email_Distribution_Groups_7" value="LIB-UXAG">
									LIB-UXAG
								</label>
				    		</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_38" value="LIBRARYACQ EMAIL" />
								LIBRARYACQ EMAIL
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_39" value="LIBSYS EMAIL" />
								LIBSYS EMAIL
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_72" value="3DMCLURE EMAIL" />
								MCLURE 3D PRINTING EMAIL
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_73" value="CALMCLURE EMAIL" />
								MCLURE CALENDAR EMAIL
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_40" value="MCLUREILL EMAIL" />
								MCLUREILL EMAIL 
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_41" value="MCLURELIB EMAIL" />
								MCLURELIB EMAIL 
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_74" value="MUSICLIB EMAIL" />
								MUSIC LIBRARY EMAIL
								</label>
							</div>
						</div>
						<div class="col-md-6" id="email-right-col">
							<div class="checkbox"> 
								<label>
								<input type="checkbox" class="email_distribution_groups" name="OBKey_UL_Email_Distribution_Groups_8" value="OLT">
									OLT
								</label>
				    		</div>
							<div class="checkbox"> 
								<label>
									<input type="checkbox" class="email_distribution_groups" name="OBKey_UL_Email_Distribution_Groups_9" value="OLT-ACS-GLOBAL">
									OLT-ACS-GLOBAL
								</label>
				    		</div>
							<div class="checkbox"> 
								<label>
								<input type="checkbox" class="email_distribution_groups" name="OBKey_UL_Email_Distribution_Groups_10" value="OLT-ACS-STAFF">
									OLT-ACS-STAFF
								</label>
				    		</div>
							<div class="checkbox"> 
								<label>
								<input type="checkbox" class="email_distribution_groups" name="OBKey_UL_Email_Distribution_Groups_11" value="OLT-ACS-STUDENTS">
									OLT-ACS-STUDENTS
								</label>
				    		</div>
							<div class="checkbox"> 
								<label>
								<input type="checkbox" class="email_distribution_groups" name="OBKey_UL_Email_Distribution_Groups_12" value="OLT-DS">
									OLT-DS
								</label>
				    		</div>				    		
							<div class="checkbox"> 
								<label>
								<input type="checkbox" class="email_distribution_groups" name="OBKey_UL_Email_Distribution_Groups_13" value="OLT-ERES">
									OLT-ERES
								</label>
				    		</div>								
							<div class="checkbox"> 
								<label>
								<input type="checkbox" class="email_distribution_groups" name="OBKey_UL_Email_Distribution_Groups_14" value="OLT-Global">
									OLT-Global
								</label>
				    		</div>
							<div class="checkbox"> 
								<label>
								<input type="checkbox" class="email_distribution_groups" name="OBKey_UL_Email_Distribution_Groups_15" value="OLT-LIB-LEC">
									OLT-LIB-LEC
								</label>
				    		</div>
							<div class="checkbox"> 
								<label>
								<input type="checkbox" class="email_distribution_groups" name="OBKey_UL_Email_Distribution_Groups_16" value="OLT-Managers">
									OLT-MANAGERs
								</label>
				    		</div>
							<div class="checkbox"> 
								<label>
								<input type="checkbox" class="email_distribution_groups" name="OBKey_UL_Email_Distribution_Groups_17" value="OLT-WEB">
									OLT-WEB
								</label>
				    		</div>
							<div class="checkbox"> 
								<label>
								<input type="checkbox" class="email_distribution_groups" name="OBKey_UL_Email_Distribution_Groups_18" value="OLT-WID">
									OLT-WID
								</label>
				    		</div>
							<div class="checkbox"> 
								<label>
								<input type="checkbox" class="email_distribution_groups" name="OBKey_UL_Email_Distribution_Groups_19" value="Resource-Acquisitions-Discovery">
									Resource-Acquisitions-Discovery
								</label>
				    		</div>
							<div class="checkbox"> 
								<label>
								<input type="checkbox" class="email_distribution_groups" name="OBKey_UL_Email_Distribution_Groups_20" value="RI-CIRC-GLOBAL">
									RI-CIRC-GLOBAL
								</label>
				    		</div>
							<div class="checkbox"> 
								<label>
								<input type="checkbox" class="email_distribution_groups" name="OBKey_UL_Email_Distribution_Groups_21" value="RI-CIRC-STAFF">
									RI-CIRC-STAFF
								</label>
				    		</div>
							<div class="checkbox"> 
								<label>
								<input type="checkbox" class="email_distribution_groups" name="OBKey_UL_Email_Distribution_Groups_22" value="RI-CIRC-STUDENTS">
									RI-CIRC-STUDENTS
								</label>
				    		</div>
							<div class="checkbox"> 
								<label>
								<input type="checkbox" class="email_distribution_groups" name="OBKey_UL_Email_Distribution_Groups_23" value="RL-CIRC-STAFF">
									RL-CIRC-STAFF
								</label>
              </div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_76" value="3DRODGERS EMAIL" />
								RODGERS 3D PRINTING EMAIL
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_77" value="CALRODGERS EMAIL" />
								RODGERS CALENDAR EMAIL
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_46" value="RUSHCATS EMAIL" />
								RUSHCATS EMAIL 
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_48" value="SELILL EMAIL" />
								SELILL EMAIL 
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_49" value="SMC EMAIL" />
								SMC EMAIL
								</label>
							</div>
							<div class="checkbox">
								<label>
								<input type="checkbox" class="departmental_share_access" name="OBKey_UL_Departmental_Share_Access_82" value="SMC-STAFF" />
								SMC-STAFF
								</label>
							</div>
							<div class="checkbox">	
								<label>
								<input type="checkbox" class="web_services" name="OBKey_UL_Departmental_Share_Access_55" value="WEBDEV EMAIL" />
								WEBDEV EMAIL
								</label>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

 <hr>

 <div class="form-group">
      <label for="comment">Comments:</label>
		<textarea name="comment" class="form-control" rows="3" id="comment"></textarea>
 </div>
		
		<!--
		<button name="OBBtn_Yes" id="submitbutton" type="submit" class="btn btn-primary btn-lg">  
			Submit
		</button>  
		-->
		
		<input type="submit" id="submit" name="OBBtn_Yes" value="Submit" class="navbtn btn btn-primary btn-lg" />
		
	</form> 
</div>


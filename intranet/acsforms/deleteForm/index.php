    
        
  <div class="container">
		<form action="https://imageweb-test.ua-net.ua.edu/Public/LoginFormProc.aspx?FromLoginFormProc=true" method="post">
		
			<!-- Begin Required OnBase Fields -->
			<div id="loginformprocparams"> 
				<input type="hidden" name="LanguageParam" value="en-us" />
				<input type="hidden" name="OBWeb_FinalTargetPage" value="http://lib.ua.edu.local/intranet/delete-form-landing"/>
				<input type="hidden" name="OBDocumentType" value="775" />
				<input type="hidden" name="OBWeb_Redirect" value="http://lib.ua.edu.local/intranet/delete-form-landing"/>
			</div>
			<!-- End Required OnBase Fields -->
				
		 
				<img src="images/librariesk_black.png" alt="UA Libraries Logo" style="width:150px;height:60px"> 
		        <h1 class="h2">Security Authorization Form</h1>
			    <h2 class="h3">Deleting Network and Voyager Access </h2> 
				<hr>
			
			<div class="row">
				<div class="col-md-4">
					<fieldset class="form-group">
						<label for="field1">
							Effective Date: 
						</label>
						<input required type="date" class="form-control" name="OBKey_Effective_Date_1" id="field1">
					</fieldset>
				</div>
				
				<div class="col-md-3">
					<fieldset class="form-group">
					<label style="margin-bottom: 10px;">Employee Type</label>
						<div class="row">
							<div class="col-md-4">
								
									<label class="radio-inline">
										<input required type="radio" name="OBKey_Employee_Type_1" value="FACULTY/PROFESSIONAL">
										Faculty
									</label>
								
							</div>
							<div class="col-md-4">
						
									<label class="radio-inline">
										<input type="radio" name="OBKey_Employee_Type_1" value="STAFF">
										Staff 
									</label>
								
							</div>
							<div class="col-md-4">
								
									<label class="radio-inline">
										<input type="radio" name="OBKey_Employee_Type_1" value="STUDENT/GTA/INTERN">
										Student
									</label>
								
							</div>
						</div>	
					</fieldset>
				</div>
	     </div>
			 

			

			 
			<div class="row">
				<div class="col-md-4">
					<fieldset class="form-group">
						<label for="field45">
							Submitter
						</label>
						<input required type="text" class="form-control" name="OBKey_Submitter_1" id="field45">
					</fieldset>
				</div>
				<div class="col-md-4">
					<fieldset class="form-group">
						<label for="field46">
							Submitter's Telephone (last 4 digits) 
						</label>
						<input required type="text" class="form-control" name="OBKey_Submitters_Phone_Number_1" id="field46">
					</fieldset>
				</div>	
				<div class="col-md-4">
					<fieldset class="form-group">
						<label for="field47">
							Submitter's Email
						</label>
						<input required type="text" class="form-control" name="OBKey_Submitters_Email_1" id="field47">
					</fieldset>
				</div>	
		</div>		
		
<!-- Supervisor Information Row -->
		<div class="row">
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
								<option>Emy Decker</option>
					</select>
				</fieldset>
			</div>
			<div class="col-md-4">
				<fieldset class="form-group">
					<label for="AssociateDeanPhone">
						Associate Dean's Telephone (last 4 digits) 
					</label>
					<input required class="form-control" name="OBKey_Associate_Dean_Phone_1" id="AssociateDeanPhone">
				</fieldset>
			</div>	
			<div class="col-md-4">
				<fieldset class="form-group">
					<label for="AssociateDeanEmail">
						Associate Dean's Email
					</label>
					<input required type="email" class="form-control" name="OBKey_Associate_Dean_Email_1" id="AssociateDeanEmail">
				</fieldset>
			</div>

		</div>

<!-- Begin Users to Remove -->
		<div class="row">
         <div class="col-md-2">
			<label for="field5">
				First Name
			</label>
			<input required type="text" class="form-control" name="FirstName1" id="field5">
		</div>	
		<div class="col-md-3">
			<label for="field6">
				Last Name
			</label>
			<input required type="text" class="form-control" name="LastName1" id="field6">
		</div>	
		<div class="col-md-4">
			<label for="field7">
				Valid UA e-mail (@ua.edu, @crimson.ua.edu)
			</label>
			<input required type="email" class="form-control" name="Email1" id="field7">
		</div>
		<div class="col-md-3">
			<label for="field8">
				Current User ID (for existing users)
			</label>
			<input required type="text" class="form-control" name="UserID1" id="field8">
		</div>

		<div class="col-md-2">
			<label class="sr-only" for="field9">
				First Name
			</label>
			<input type="text" class="form-control" name="FirstName2" id="field9">
		</div>
		<div class="col-md-3">
			<label class="sr-only" for="field10">
				Last Name
			</label>
			<input type="text" class="form-control" name="LastName2" id="field10">
		</div>	
		<div class="col-md-4">
			<label class="sr-only" for="field11">
				Valid Email Address
			</label>
			<input type="email" class="form-control" name="Email2" id="field11">
		</div>
		<div class="col-md-3">
			<label class="sr-only" for="field12">
				Current User ID (for existing users)
			</label>
			<input type="text" class="form-control" name="UserID2" id="field12">
		</div>
		
		<div class="col-md-2">
			<label class="sr-only" for="field13">
				First Name
			</label>
			<input type="text" class="form-control" name="FirstName3" id="field13">
		</div>
		<div class="col-md-3">
			<label class="sr-only" for="field14">
				Last Name
			</label>
			<input type="text" class="form-control" name="LastName3" id="field14">
		</div>
		<div class="col-md-4">
			<label class="sr-only" for="field15">
				Valid Email Address
			</label>
			<input type="email" class="form-control" name="Email3" id="field15">
		</div>
		<div class="col-md-3">
			<label class="sr-only" for="field16">
				Current User ID (for existing users)
			</label>
			<input type="text" class="form-control" name="UserID3" id="field16">
		</div>
		
		<div class="col-md-2">
			<label class="sr-only" for="field17">
				First Name
			</label>
			<input type="text" class="form-control" name="FirstName4" id="field17">
		</div>
		<div class="col-md-3">
			<label class="sr-only" for="field18">
				Last Name
			</label>
			<input type="text" class="form-control" name="LastName4" id="field18">
		</div>
		<div class="col-md-4">
			<label class="sr-only" for="field17">
				Valid Email Address
			</label>
			<input type="email" class="form-control" name="Email4" id="field19">
		</div>
		<div class="col-md-3">
			<label class="sr-only" for="field20">
				Current User ID (for existing users)
			</label>
			<input type="text" class="form-control" name="UserID4" id="field20">
		</div>	
		
		<div class="col-md-2">
			<label class="sr-only" for="field21">
				First Name
			</label>
			<input type="text" class="form-control" name="FirstName5" id="field21">
		</div>
		<div class="col-md-3">
			<label class="sr-only" for="field22">
				Last Name
			</label>
			<input type="text" class="form-control" name="LastName5" id="field22">
		</div>
		<div class="col-md-4">
			<label class="sr-only" for="field23">
				Valid Email Address
			</label>
			<input type="email" class="form-control" name="Email5" id="field23">
		</div>		
		<div class="col-md-3">
			<label class="sr-only" for="field24">
				Current User ID (for existing users)
			</label>
			<input type="text" class="form-control" name="UserID5" id="field24">
		</div>	
		
		<div class="col-md-2">
			<label class="sr-only" for="field25">
				First Name
			</label>
			<input type="text" class="form-control" name="FirstName6" id="field25">
		</div>
		<div class="col-md-3">
			<label class="sr-only" for="field26">
				Last Name
			</label>
			<input type="text" class="form-control" name="LastName6" id="field26">
		</div>
		<div class="col-md-4">
			<label class="sr-only" for="field27">
				Valid Email Address
			</label>
			<input type="email" class="form-control" name="Email6" id="field27">
		</div>		
		<div class="col-md-3">
			<label class="sr-only" for="field28">
				Current User ID (for existing users)
			</label>
			<input type="text" class="form-control" name="UserID6" id="field28">
		</div>	
		
		<div class="col-md-2">
			<label class="sr-only" for="field29">
				First Name
			</label>
			<input type="text" class="form-control" name="FirstName7" id="field29">
		</div>
		<div class="col-md-3">
			<label class="sr-only" for="field30">
				Last Name
			</label>
			<input type="text" class="form-control" name="LastName7" id="field30">
		</div>
		<div class="col-md-4">
			<label class="sr-only" for="field31">
				Valid Email Address
			</label>
			<input type="email" class="form-control" name="Email7" id="field31">
		</div>		
		<div class="col-md-3">
			<label class="sr-only" for="field32">
				Current User ID (for existing users)
			</label>
			<input type="text" class="form-control" name="UserID7" id="field32">
		</div>		
		
		<div class="col-md-2">
			<label class="sr-only" for="field33">
				First Name
			</label>
			<input type="text" class="form-control" name="FirstName8" id="field33">
		</div>
		<div class="col-md-3">
			<label class="sr-only" for="field34">
				Last Name
			</label>
			<input type="text" class="form-control" name="LastName8" id="field34">
		</div>
		<div class="col-md-4">
			<label class="sr-only" for="field35">
				Valid Email Address
			</label>
			<input type="email" class="form-control" name="Email8" id="field35">
		</div>		
		<div class="col-md-3">
			<label class="sr-only" for="field36">
				Current User ID (for existing users)
			</label>
			<input type="text" class="form-control" name="UserID8" id="field36">
		</div>	
		
		<div class="col-md-2">
			<label class="sr-only" for="field37">
				First Name
			</label>
			<input type="text" class="form-control" name="FirstName9" id="field37">
		</div>
		<div class="col-md-3">
			<label class="sr-only" for="field38">
				Last Name
			</label>
			<input type="text" class="form-control" name="LastName9" id="field38">
		</div>
		<div class="col-md-4">
			<label class="sr-only" for="field39">
				Valid Email Address
			</label>
			<input type="email" class="form-control" name="Email9" id="field39">
		</div>		
		<div class="col-md-3">
			<label class="sr-only" for="field40">
				Current User ID (for existing users)
			</label>
			<input type="text" class="form-control" name="UserID9" id="field40">
		</div>	
		
		<div class="col-md-2">
			<label class="sr-only" for="field41">
				First Name
			</label>
			<input type="text" class="form-control" name="FirstName10" id="field41">
		</div>
		<div class="col-md-3">
			<label class="sr-only" for="field42">
				Last Name
			</label>
			<input type="text" class="form-control" name="LastName10" id="field42">
		</div>
		<div class="col-md-4">
			<label class="sr-only" for="field43">
				Valid Email Address
			</label>
			<input type="email" class="form-control" name="Email10" id="field43">
		</div>		
		<div class="col-md-3">
			<label class="sr-only" for="field44">
				Current User ID (for existing users)
			</label>
			<input type="text" class="form-control" name="UserID10" id="field44">
		</div>
		
		<div class="col-md-2">
			<label class="sr-only" for="field45">
				First Name
			</label>
			<input type="text" class="form-control" name="FirstName11" id="field45">
		</div>
		<div class="col-md-3">
			<label class="sr-only" for="field46">
				Last Name
			</label>
			<input type="text" class="form-control" name="LastName11" id="field46">
		</div>
		<div class="col-md-4">
			<label class="sr-only" for="field47">
				Valid Email Address
			</label>
			<input type="email" class="form-control" name="Email11" id="field47">
		</div>		
		<div class="col-md-3">
			<label class="sr-only" for="field48">
				Current User ID (for existing users)
			</label>
			<input type="text" class="form-control" name="UserID11" id="field48">
		</div>
		
		<div class="col-md-2">
			<label class="sr-only" for="field49">
				First Name
			</label>
			<input type="text" class="form-control" name="FirstName12" id="field49">
		</div>
		<div class="col-md-3">
			<label class="sr-only" for="field50">
				Last Name
			</label>
			<input type="text" class="form-control" name="LastName12" id="field50">
		</div>
		<div class="col-md-4">
			<label class="sr-only" for="field51">
				Valid Email Address
			</label>
			<input type="email" class="form-control" name="Email12" id="field51">
		</div>		
		<div class="col-md-3">
			<label class="sr-only" for="field52">
				Current User ID (for existing users)
			</label>
			<input type="text" class="form-control" name="UserID12" id="field52">
		</div>
		
		<div class="col-md-2">
			<label class="sr-only" for="field53">
				First Name
			</label>
			<input type="text" class="form-control" name="FirstName13" id="field53">
		</div>
		<div class="col-md-3">
			<label class="sr-only" for="field54">
				Last Name
			</label>
			<input type="text" class="form-control" name="LastName13" id="field54">
		</div>
		<div class="col-md-4">
			<label class="sr-only" for="field55">
				Valid Email Address
			</label>
			<input type="email" class="form-control" name="Email13" id="field55">
		</div>		
		<div class="col-md-3">
			<label class="sr-only" for="field56">
				Current User ID (for existing users)
			</label>
			<input type="text" class="form-control" name="UserID13" id="field56">
		</div>
	
	</div>
		
		
        <div class="row">
			<div class="col-md-12">      
				<fieldset class="form-group">
					<label for="Comments">Comments:</label>
					<textarea class="form-control" id="Comments" name="comments" rows="3"></textarea>
				</fieldset>
			</div>
		</div>
		<!--
		<button name="submitbutton" id="submitbutton" type="submit" class="btn btn-primary btn-lg">  
			Submit
		</button>  
		-->
		<input type="submit" id="submit" name="OBBtn_Yes" value="Submit" class="navbtn btn btn-primary btn-lg" />

	</form> 
	</div>			  
      

	<div class="container">
	<div class="row">
	<form action="https://imageweb-test.ua-net.ua.edu/Public/LoginFormProc.aspx?FromLoginFormProc=true" method="post">
	
			<!-- Begin Required OnBase Fields -->
			<div id="loginformprocparams"> 
				<input type="hidden" name="LanguageParam" value="en-us" />
				<input type="hidden" name="OBWeb_FinalTargetPage" value="https://wwwdev2.lib.ua.edu/intranet/voyager-only-form-landing"/>
				<input type="hidden" name="OBDocumentType" value="887" />
				<input type="hidden" name="OBWeb_Redirect" value="https://wwwdev2.lib.ua.edu/intranet/voyager-only-form-landing"/>
			</div>
			<!-- End Required OnBase Fields -->	
	    <div class="row">
	    	<div class="col-md-4">
				<fieldset class="form-group">
					<label for="field1">
						Effective Date: 
					</label>
					<input type="date" class="form-control" name="OBKey_Effective_Date_1" id="field1" required>
				</fieldset>
			</div>
	    </div>
			
		<div class="row">	
			<div class="col-md-4">
				<fieldset class="form-group">
					<label for="field49">
						Submitter
					</label>
					<input required type="text" class="form-control" name="OBKey_Submitter_1" id="field49">
				</fieldset>
			</div>
			<div class="col-md-3">
				<fieldset class="form-group">
					<label for="field50">
						Submitter's Telephone (last 4 digits)
					</label>
					<input required type="text" class="form-control" name="OBKey_Submitters_Phone_Number_1" id="field50">
				</fieldset>
			</div>
			<div class="col-md-5">
				<fieldset class="form-group">
					<label for="field51">
						Submitter's Email
					</label>
					<input required type="text" class="form-control" name="OBKey_Submitters_Email_1" id="field51">
				</fieldset>
			</div>	
		</div>
		
		<div class="row">	
			<div class="col-md-4">
				<fieldset class="form-group">
					<label for="AssociateDean">
						Associate Dean
					</label>
					<select required type="text" class="form-control" name="OBKey_Associate_Dean_Name_1" id="AssociateDean">					
							<option selected></option>
							<option>Tom Wilson</option>
							<option>Millie Jackson</option>
							<option>Lorraine Madway</option>
					</select>
				</fieldset>
			</div>
			<div class="col-md-3">
				<fieldset class="form-group">
					<label for="AssociateDeanPhone">
						Associate Dean's Telephone (last 4 digits)
					</label>
					<input required type="text" class="form-control" name="OBKey_Associate_Dean_Phone_1" id="AssociateDeanPhone">
				</fieldset>
			</div>
			<div class="col-md-5">
				<fieldset class="form-group">
					<label for="AssociateDeanEmail">
						Associate Dean's Email
					</label>
					<input required type="email" class="form-control" name="OBKey_Associate_Dean_Email_1" id="AssociateDeanEmail">
				</fieldset>
			</div>	
		</div>

	
   <div class="panel-group" id="accordion1">
		  <div class="panel panel-default">
		    <div class="panel-heading">
			  <h4 class="panel-title">
			   Account Information (First Name, Last Name, Email Address) 
			  </h4>
			</div>  
			<div id="collapse1" class="panel-collapse">
				<div class="panel-body">	
					<div class="row">
					<div class="col-md-8">
							<label for="field4">
								Employee Name (First Middle Last)
							</label>
							<input required type="text" class="form-control" name="OBKey_Employee_Name_1" id="field4" >
					</div>	
					<div class="col-md-4">
						<label for="field6">
							Valid UA e-mail (@crimson.ua.edu)
						</label>
					<input type="text" class="form-control" name="OBKey_Employee_Email_1" id="field6" required>
					</div>
	
				</div>	
			</div>
		</div>
	</div>
</div>
    <div class="form-group">
      <label for="comment">Comments:</label>
      <textarea class="form-control" rows="3" id="comment" name="comment"></textarea>
    </div>
	
	
	<input type="submit" id="submit" name="OBBtn_Yes" value="Submit" class="navbtn btn btn-primary btn-lg" />
	
</form> 


</div>
</div>

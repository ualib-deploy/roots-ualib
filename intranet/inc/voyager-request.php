  <div class="col-md-12 well">
    <form action="/intranet/voyager-request-result" id="MailForm" method="post" name="MailForm">
      <div class="row">
          <div class="col-sm-6 form-group">
							<div class="input-group">
								<span class="input-group-addon"><span class="required">*</span> Name</span> <input class="form-control" id="RequestorName" name="RequestorName" placeholder="Enter Your Name Here.." type="text" /></div>
						</div>
						<div class="col-sm-6 form-group">
							<div class="input-group">
								<span class="input-group-addon"><span class="required">*</span> E-Mail</span> <input class="form-control" id="RequestorEmail" name="RequestorEmail" placeholder="Enter Your E-Mail Here.." type="text" /></div>
						</div>
      </div> 
    <div class="row">
						<div class="col-sm-6 form-group">
							<div class="input-group">
								<span class="input-group-addon">Department</span> <input class="form-control" id="RequestorDept" name="RequestorDept" placeholder="Enter Your Department Here.." type="text" /></div>
						</div>
						<div class="col-sm-6 form-group">
							<div class="input-group">
								<span class="input-group-addon"><span class="required">*</span> Phone</span> <input class="form-control" id="RequestorPhone" name="RequestorPhone" placeholder="Enter Your Phone Here.." type="text" /></div>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-12 form-group">
							<div class="input-group">
								<span class="input-group-addon">Report Title</span> <input class="form-control" id="ReportTitle" name="ReportTitle" placeholder="Enter Your Desired Report Title Here.." type="text" /></div>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-4 form-group">
							<div class="input-group">
								<span class="input-group-addon"><span class="required">*</span> Date Needed</span> <input class="form-control" id="NeededBy" name="NeededBy" placeholder="Enter Date Needed Here.." type="text" /></div>
						</div>
						<div class="col-sm-4 form-group">
							<div class="input-group">
								<span class="input-group-addon"><span class="required">*</span> Frequency</span> <select class="form-control" id="Frequency" name="Frequency"><option value=" "></option><option value="Run Once">Once</option><option value="Run Weekly">Weekly</option><option value="Run Monthly">Monthly</option><option value="Run Quarterly">Quarterly</option><option value="Run at end of Fiscal Year">End of Fiscal Year</option></select></div>
						</div>
						<div class="col-sm-4 form-group">
							<div class="input-group">
								<span class="input-group-addon"><span class="required">*</span> Output Format</span> <select class="form-control" id="OutputFormat" name="OutputFormat"><option value=" "></option><option value="Excel">MS Excel</option><option value="CSV">Comma Delimited Text</option><option value="Tab Delimited">Tab Delimited Text</option><option value="PDF">PDF</option></select></div>
						</div>
					</div>
      <div class="form-group">
            <label><span class="required">*</span> Provide a brief description of the purpose of the report and how it will be used.</label><textarea class="form-control" id="Description" name="Description" placeholder="Enter Description Here.." rows="3"></textarea>
      </div>
			<!-- Start Field Choices -->
					<div class="panel panel-default">
						<div class="panel-heading">
              <span class="required">*</span> Fields to include on final report. (Some example fields are listed below)
            </div>
						<div class="panel-body">
							<div class="row col-lg-12">
								<div class="row">
									<div class="col-lg-4">
										<span><strong>Title/BIB Level Fields</strong></span>
										<div>
											<label>BIB ID</label></div>
										<div>
											<label>TITLE</label></div>
										<div>
											<label>AUTHOR</label></div>
										<div>
											<label>PUBLISHER</label></div>
										<div>
											<label>PUBLICATION PLACE</label></div>
										<div>
											<label>PUBLISHER DATE</label></div>
										<div>
											<label>OWNING LIBRARY</label></div>
									</div>
									<div class="col-lg-4">
										<span><strong>Holdings/MFHD Level Fields</strong></span>
										<div>
											<label>MFHD ID</label></div>
										<div>
											<label>DISPLAY CALL NUMBER</label></div>
										<div>
											<label>NORMALIZED CALL NUMBER (For sorting)</label></div>
										<div>
											<label>HOLDINGS LOCATION</label></div>
									</div>
									<div class="col-lg-4">
										<span><strong>Item Level Fields</strong></span>
										<div>
											<label>ITEM ID</label></div>
										<div>
											<label>ITEM BARCODE</label></div>
										<div>
											<label>ITEM LOCATION</label></div>
										<div>
											<label>ITEM TYPE</label></div>
										<div>
											<label>ITEM STATUS</label></div>
										<div>
											<label>ITEM ENUMERATION</label></div>
										<div>
											<label>CHRONOLOGY</label></div>
									</div>
								</div>
							</div>
							<br />
							<div>
								<span><strong>Indicate your fields below. One Per line.</strong></span></div>
							<br />
							<!-- <div class="row" id="voy_fields">
						
						</div> -->
							<div class="form-group">
                <textarea class="form-control" id="voyfields" name="voyfields" placeholder="Example: (Field) | (Criteria, Optional)" rows="6"></textarea>
              </div>
						</div>
					</div>
				<!-- End Field Choices -->		
        <!-- Begin Location Choice Div -->
				<div class="rg-padding">
          <span><span class="required">*</span> Limit by Owning Library?</span>&nbsp; <input id="hide-lib" name="LibraryLimit" type="radio" value="No" /> <label for="hide-lib">No &nbsp;</label> <input id="show-lib" name="LibraryLimit" type="radio" value="Yes" /> <label for="show-lib">Yes</label>&nbsp; <span>(By default, CRL will be excluded from all reports unless indicated otherwise.)</span>
        </div>
				<div class="collapse" id="library" style="padding: 0px 0px 0px 10px; overflow: hidden; display: none; background-color: rgb(235, 235, 235);">
					<div class="btn-group">
						<span class="required">*</span>&nbsp; <input id="ExcludeLibraries" name="LibraryOption" type="radio" value=", Exclude the following owning libraries" /> <label for="ExcludeLibraries">&nbsp;Exclude</label> <span> the following owning libraries.</span>&nbsp;&nbsp;<input id="IncludeLibraries" name="LibraryOption" type="radio" value=", Include the following owning libraries" /> <label for="IncludeLibraries">&nbsp;Include</label><span> <strong>ONLY</strong> the following owning libraries.</span></div>
					<br />
					<br />
					<div class="checkbox">
						<label><input name="library[]" type="checkbox" value="MN" /> <span class="custom-control-description">Main(MN)</span> </label></div>
					<div class="checkbox">
						<label><input name="library[]" type="checkbox" value="GP" /> <span class="custom-control-description">Government Documents(GP)</span> </label></div>
					<div class="checkbox">
						<label><input name="library[]" type="checkbox" value="HS" /> <span class="custom-control-description">Health Sciences(HS)</span> </label></div>
					<div class="checkbox">
						<label><input name="library[]" type="checkbox" value="CRL" /> <span class="custom-control-description">Center for Research libraries(CRL)</span> </label></div>
					<div class="checkbox">
						<label><input name="library[]" type="checkbox" value="Reserve" /> <span class="custom-control-description">Reserve</span> </label></div>
				</div>
				<div class="rg-padding">
          <span><span class="required">*</span> Limit by Location(s)?</span>&nbsp; <input id="hide-loc" name="LocationLimit" type="radio" value="No" /> <label for="hide-loc">No &nbsp;</label> <input id="show-loc" name="LocationLimit" type="radio" value="Yes" /> <label for="show-loc">Yes</label>&nbsp; <span>(If you choose &quot;no&quot;, all Voyager Locations will be included in the report.)</span>
        </div>
				<div class="collapse" id="location" style="padding: 0px 0px 0px 10px; overflow: hidden; display: none; background-color: rgb(235, 235, 235);">
					<!--	<label for="LocationType" class="control-label input-group">Choose Location Type</label> --><span><span class="required">*</span> Choose Location Type</span>&nbsp;
					<div class="btn-group">
						<input id="ItemLocations" name="LocationType" type="radio" value="Item Locations" /> <label for="ItemLocations">&nbsp; Item Location(s) &nbsp;</label> <input id="HoldingLocations" name="LocationType" type="radio" value="Holding Locations" /> <label for="HoldingLocations">&nbsp; Holding Location(s) </label></div>
					<br />
					<br />
					<span class="required">*</span>&nbsp;
					<div class="btn-group">
						<input id="ExcludeLocations" name="LocationOption" type="radio" value=", Exclude the following " /> <label for="ExcludeLocations">&nbsp; Exclude</label> <span> the following locations.</span>&nbsp;&nbsp;<input id="IncludeLocations" name="LocationOption" type="radio" value=", Include the following " /> <label for="IncludeLocations">&nbsp; Include</label><span> <strong>ONLY</strong> the following locations.</span></div>
					<br />
					<br />
					<!--	<div>
								<span>Location Type?&nbsp;&nbsp;</span><label class="radio-inline"><input id="ItemLocations" name="LocationType" type="radio" value="Item Locations">Item Location(s)</label> <label class="radio-inline"><input id="HoldingLocations" name="LocationType" type="radio" value="Holding Locations">Holding Location(s)</label>
							</div><br />
							<div>
								<span>The following location(s) should be&nbsp;&nbsp;</span><label class="radio-inline"><input id="ExcludeLocations" name="LocationOption" type="radio" value=", Exclude the following locations">Excluded</label> <label class="radio-inline"><input id="IncludeLocations" name="LocationOption" type="radio" value=", Include the following locations">Included</label> 
							</div>
							<br> -->
					<div style="width: 100%; display: table;">
						<div style="display: table-row;">
							<div id="gorgloc" style="width: 250px; display: table-cell;">
								<strong>Gorgas Locations</strong><br />
								<div class="checkbox">
									<label><input name="loc[]" type="checkbox" value="All Gorgas Locations" />All Gorgas Locations</label></div>
								<?php foreach ($g_location as $g_loc) {
										                                echo "<div class='checkbox'><label><input type='checkbox' name=\"loc[]\" value='$g_loc' >$g_loc</label></div>";} ?></div>
							<div id="hooleloc" style="width: 250px; display: table-cell;">
								<strong>Hoole Locations</strong><br />
								<div class="checkbox">
									<label><input name="loc[]" type="checkbox" value="All Hoole Locations" />All Hoole Locations</label></div>
								<?php foreach ($h_location as $h_loc) {
										                            echo "<div class='checkbox'><label><input type='checkbox' name=\"loc[]\" value='$h_loc' >$h_loc</label></div>"; } ?><br />
								&nbsp;</div>
							<div id="bus-educloc" style="width: 250px; display: table-cell;">
								<strong>Bruno Locations</strong><br />
								<div class="checkbox">
									<label><input name="loc[]" type="checkbox" value="All Bruno Locations" />All Bruno Locations</label></div>
								<?php foreach ($b_location as $b_loc) {
										                                echo "<div class='checkbox'><label><input type='checkbox' name=\"loc[]\" value='$b_loc' >$b_loc</label></div>";} ?><br />
								<br />
								<strong>McLure Locations</strong><br />
								<div class="checkbox">
									<label><input name="loc[]" type="checkbox" value="All McLure Locations" />All McLure Locations</label></div>
								<?php foreach ($e_location as $e_loc) {
										                                echo "<div class='checkbox'><label><input type='checkbox' name=\"loc[]\" value='$e_loc' >$e_loc</label></div>";} ?><br />
								&nbsp;</div>
						</div>
						<div style="width: 250px; display: table-row;">
							<div id="selloc" style="width: 250px; display: table-cell;">
								<strong>Rodgers Locations</strong><br />
								<div class="checkbox">
									<label><input name="loc[]" type="checkbox" value="All Rodgers Locations" />All Rodgers Locations</label></div>
								<?php foreach ($r_location as $r_loc) {
										                                echo "<div class='checkbox'><label><input type='checkbox' name=\"loc[]\" value='$r_loc' >$r_loc</label></div>";} ?><br />
								&nbsp;</div>
							<div id="hsl-annxloc" style="width: 250px; display: table-cell;">
								<strong>Health Science Locations</strong><br />
								<div class="checkbox">
									<label><input name="loc[]" type="checkbox" value="All Health Science Locations" />All Health Science Locations</label></div>
								<?php foreach ($hs_location as $hs_loc) {
										                                echo "<div class='checkbox'><label><input type='checkbox' name=\"loc[]\" value='$hs_loc' >$hs_loc</label></div>";} ?><br />
								<br />
								<strong>Annex Locations</strong><br />
								<div class="checkbox">
									<label><input name="loc[]" type="checkbox" value="All Annex Locations" />All Annex Locations</label></div>
								<?php foreach ($a_location as $a_loc) {
										                                echo "<div class='checkbox'><label><input type='checkbox' name=\"loc[]\" value='$a_loc' >$a_loc</label></div>";} ?><br />
								&nbsp;</div>
							<div id="otherloc" style="width: 250px; display: table-cell;">
								<strong>All Other Locations</strong><br />
								<?php foreach ($o_location as $o_loc) {
										                                echo "<div class='checkbox'><label><input type='checkbox' name=\"loc[]\" value='$o_loc' >$o_loc</label></div>";} ?></div>
						</div>
					</div>
				</div>
        <!-- </div> -->
        <!-- End Location Choice Div -->
        <!-- Begin Item Type Div -->
				<div class="rg-padding">
          <span><span class="required">*</span> Limit by Item Type(s)?</span>&nbsp; <input id="hide-type" name="TypeLimit" type="radio" value="No" /> <label for="hide-type">No &nbsp;</label> <input id="show-type" name="TypeLimit" type="radio" value="Yes" /> <label for="show-type">Yes</label>&nbsp; <span>(If you choose &quot;no&quot;, all Voyager Item Types will be included in the report.) </span>
        </div>
				<div id="type" style="padding: 0px 0px 0px 10px; display: none; background-color: rgb(235, 235, 235);">
					<div>
						<span class="required">*</span>&nbsp; <input id="ExcludeTypes" name="TypeOption" type="radio" value=", Exclude the following item types" /> <label for="Excludetypes">Exclude</label> the following Item Types.&nbsp;&nbsp;<input id="IncludeTypes" name="TypeOption" type="radio" value=", Include the following item types" /> <label for="IncludeTypes">Include</label> <strong>ONLY</strong> the following Item Types.</div>
					<div>
						<br />
						<?php foreach ($type as $type) {
								                                echo "<div class='checkbox'><label><input type='checkbox' name=\"type[]\" value='$type' />$type</label></div>"; } ?><br />
						&nbsp;</div>
				</div>
				<!-- End Item Type Div -->
        <!-- Begin Item Status Div -->
				<div class="rg-padding">
					<span><span class="required">*</span> Limit by Item Status?</span>&nbsp; <input id="hide-status" name="StatusLimit" type="radio" value="No" /> <label for="hide-status">No &nbsp;</label> <input id="show-status" name="StatusLimit" type="radio" value="Yes" /> <label for="show-status">Yes</label></div>
				<div id="status" style="padding: 0px 0px 0px 10px; display: none; background-color: rgb(235, 235, 235);">
					<div>
						<span class="required">*</span> <input id="ExcludeStatus" name="StatusOption" type="radio" value=", Exclude the following item statuses" /> <label for="ExcludeStatus">Exclude</label> the following Item Status &nbsp;<input id="IncludeStatus" name="StatusOption" type="radio" value=", Include the following item statuses" /> <label for="IncludeStatus">Include</label></div>
					<div>
						<br />
						<?php foreach ($status as $stat) {
								                                echo "<div class='checkbox'><label><input type='checkbox' name=\"stat[]\" value='$stat' />$stat</label></div>"; } ?><br />
						&nbsp;</div>
				</div>
				<!-- End Item Status Div -->
        <!-- Begin Suppressed Records Div -->
				<div class="rg-padding">
          <span><span class="required">*</span> Suppressed Records?</span>&nbsp; <input id="include" name="SuppressedRecords" type="radio" value="Include Suppressed" /> <label for="include">&nbsp; Include</label> <input id="exclude" name="SuppressedRecords" type="radio" value="Exclude Suppressed" /> <label for="exclude">&nbsp; Exclude</label>
        </div>
        <!-- End Suppressed Records Div -->
        <!-- Begin Sort Records Div -->
				<div class="rg-padding">
          <span><span class="required">*</span> Sort Output?</span>&nbsp; <input id="no" name="SortOutput" type="radio" value="No" /> <label for="no">&nbsp; No &nbsp;</label> <input id="yes" name="SortOutput" type="radio" value="Yes, sort output by the following fields" /> <label for="yes">&nbsp; Yes</label>&nbsp;&nbsp;If Yes, indicate the field(s) to sort by: <input id="include" name="SortField" size="50" type="text" />
        </div>
				<!-- End Sort Records Div -->
      <div class="form-group">
          <label for="Attachment">If you have a file of BIBs, MFHDs or Barcodes for this report to be based on, upload it to S:\Public\Voyager Report Attachments, and indicate the filename below.</label> <input class="form-control" id="Attachment" name="Attachment" size="120" type="text" />
      </div>
      <div class="form-group">
					<label for="Info">Additional information that may help us complete this report, including criteria not specified above.</label><br />
          <textarea class="form-control" id="Info" name="Info" rows="6"></textarea>
      </div>
      <div>
					<br />
          <strong><input class="btn btn-lg" name="submit" type="submit" value="Submit Request" /> <input class="btn btn-lg" name="reset" type="reset" value="Clear Request" /></strong>
      </div>
			
    </form>
  </div>

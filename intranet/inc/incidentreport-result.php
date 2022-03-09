	<?php

// Require PHP Mailer - added this to content-page.php instead
//	require("sites/intranet.lib.ua.edu/files/incidentreport/class.phpmailer.php");

// This was not working as of 10/2019; using WP functions instead, see line 91
// Filter POST variables - Remove all bad html/css/js tags/attributes
//	require("sites/intranet.lib.ua.edu/files/incidentreport/class.inputfilter.php");
	/* $myfilter = new InputFilter(); */
	/* $_POST = $myfilter->process($_POST); */


// Test for required fields and filter email entry field

	$formhaserrors = 0;
	$formerrorlist = '';

	// Filter and validate user entered email field if not empty
	if (!empty($_POST['emailaddressalso'])) {
		$newcleanemail = filter_var($_POST['emailaddressalso'], FILTER_SANITIZE_EMAIL);

		if(filter_var($newcleanemail, FILTER_VALIDATE_EMAIL) === FALSE)  {
			$formhaserrors = 1;
			$formerrorlist .= ' - Invalid Email Address in "Send me a copy also" Field<br />';
		}
	}

	// Test for date entry
	if (empty($_POST['reportdate'])) {
		$formhaserrors = 1;
		$formerrorlist .= ' - No Date Entered for "Date of Incident"<br />';
	}

	// Test for time entry
	if (empty($_POST['reporttime'])) {
		$formhaserrors = 1;
		$formerrorlist .= ' - No Time Entered<br />';
	}

	// Test for Location entry
	if ($_POST['reportlocation'] == "None")  {
		$formhaserrors = 1;
		$formerrorlist .= ' - No Location Selected<br />';
	}

	// Test for one of the boxes under Nature of Incident to be checked
	if (empty($_POST['naturetheft']) && empty($_POST['naturevandalism']) && empty($_POST['naturetampering']) && empty($_POST['natureassault']) && empty($_POST['natureunusual']) && empty($_POST['natureviolation']) && empty($_POST['natureinjuryperson']) && empty($_POST['natureinjurybuilding']) && empty($_POST['natureunaccompanied']) && empty($_POST['natureunauthorized']) && empty($_POST['natureother'])) {

		$formhaserrors = 1;
		$formerrorlist .= ' - No "Nature of Incident" Selected<br />';
	}

	// Test for Description of Incident entry
	if (empty($_POST['longdescription'])) {
		$formhaserrors = 1;
		$formerrorlist .= ' - No "Description of Incident" Entered<br />';
	}

	// Test for Name of Person Reporting
	if (empty($_POST['personname'])) {
		$formhaserrors = 1;
		$formerrorlist .= ' - No Name Entered for "Person Reporting Incident"<br />';
	}

	// Test for Phone of Person Reporting
	if (empty($_POST['personphone'])) {
		$formhaserrors = 1;
		$formerrorlist .= ' - No Phone Entered for "Person Reporting Incident"<br />';
	}

	// Test for Email of Person Reporting
	if (empty($_POST['personemail'])) {
		$formhaserrors = 1;
		$formerrorlist .= ' - No Email Entered for "Person Reporting Incident"<br />';
	}

	// Test for Status Selection of Person Reporting
	if (empty($_POST['PersonStatusGroup'])) {
		$formhaserrors = 1;
		$formerrorlist .= ' - No Status Selected for "Person Reporting Incident"<br />';
	}

	// Test for Other Entry of Person Reporting if PersonStatusGroup = Other
	if ($_POST['PersonStatusGroup'] == "other") {
		if (empty($_POST['personotherexplain'])) {
			$formhaserrors = 1;
			$formerrorlist .= ' - Person Reporting Listed as Other, but No Explanation Given<br />';
		}
	}

  //Sanitize fields
  if ($formhaserrors != 0) {
    $_POST['reportdate'] = sanitize_text_field($_POST['reportdate']);
    $_POST['reporttime'] = sanitize_text_field($_POST['reporttime']);
    $_POST['descriptionname'] = sanitize_text_field($_POST['descriptionname']);
    $_POST['descriptionheight'] = sanitize_text_field($_POST['descriptionheight']);
    $_POST['descriptionweight'] = sanitize_text_field($_POST['descriptionweight']);
    $_POST['descriptionbuild'] = sanitize_text_field($_POST['descriptionbuild']);
    $_POST['descriptionrace'] = sanitize_text_field($_POST['descriptionrace']);
    $_POST['descriptionage'] = sanitize_text_field($_POST['descriptionage']);
    $_POST['descriptionhair'] = sanitize_text_field($_POST['descriptionhair']);
    $_POST['descriptionglasses'] = sanitize_text_field($_POST['descriptionglasses']);
    $_POST['descriptionshirt'] = sanitize_text_field($_POST['descriptionshirt']);
    $_POST['descriptionpants'] = sanitize_text_field($_POST['descriptionpants']);
    $_POST['descriptioncoat'] = sanitize_text_field($_POST['descriptioncoat']);
    $_POST['descriptionother'] = sanitize_textarea_field($_POST['descriptionother']);
    $_POST['longdescription'] = sanitize_textarea_field($_POST['longdescription']);
    $_POST['previousincidentdescription'] = sanitize_textarea_field($_POST['previousincidentdescription']);
    $_POST['personname'] = sanitize_text_field($_POST['personname']);
    $_POST['personphone'] = sanitize_text_field($_POST['personphone']);
    $_POST['personemail'] = sanitize_text_field($_POST['personemail']);
    $_POST['personotherexplain'] = sanitize_text_field($_POST['personotherexplain']);
    $_POST['personcompleting'] = sanitize_text_field($_POST['personcompleting']);
    $_POST['respondingtitlename'] = sanitize_text_field($_POST['repsondingtitlename']);
    $_POST['respondingphone'] = sanitize_text_field($_POST['respondingphone']);
    $_POST['respondingtimecalled'] = sanitize_text_field($_POST['respondingtimecalled']);
    $_POST['respondingtimearrived'] = sanitize_text_field($_POST['repsondingtimearrived']);
    $_POST['witnessname1'] = sanitize_text_field($_POST['witnessname1']);
    $_POST['witnessphone1'] = sanitize_text_field($_POST['witnessphone1']);
    $_POST['witnesswilling1'] = sanitize_text_field($_POST['witnesswilling1']);
    $_POST['witnessname2'] = sanitize_text_field($_POST['witnessname2']);
    $_POST['witnessphone2'] = sanitize_text_field($_POST['witnessphone2']);
    $_POST['witnesswilling2'] = sanitize_text_field($_POST['witnesswilling2']);
    $_POST['witnessname3'] = sanitize_text_field($_POST['witnessname3']);
    $_POST['witnessphone3'] = sanitize_text_field($_POST['witnessphone3']);
    $_POST['witnesswilling3'] = sanitize_text_field($_POST['witnesswilling3']);
    $_POST['emailaddressalso'] = sanitize_text_field($_POST['emailaddressalso']);
  }

// Compile Body ($htmlemailbody)

	if ($formhaserrors == 0) {

	// Title Block
	$htmlemailbody = '<table width="100%" border="1"><tr>
    <td align="center" bgcolor="#CCCCCC"><strong>Incident Report</strong></td>
    </tr></table>';

	// Date-Time-Loc Block
	$htmlemailbody .= '<br /><table border="1" cellpadding="3" cellspacing="0">
  	<tr><td><strong>Date of incident:</strong>' .  $_POST['reportdate'] . '</td>
    <td><strong>Time:</strong>' . $_POST['reporttime'] . '</td>
    <td><strong>Location:</strong>' . $_POST['reportlocation'] . '</td></tr></table>';

	// Nature Block - Assemble $natureattributes
	if ($_POST['naturetheft'] == "checked") $natureattributes .= '<br />-Theft';
	if ($_POST['naturevandalism'] == "checked") $natureattributes .= '<br />-Vandalism';
	if ($_POST['naturetampering'] == "checked") $natureattributes .= '<br />-Tampering with emergency mechanisms';
	if ($_POST['natureassault'] == "checked") $natureattributes .= '<br />-Assult (physical or verbal)';
	if ($_POST['natureunusual'] == "checked") $natureattributes .= '<br />-Unusual/suspicious behavior';
	if ($_POST['natureviolation'] == "checked") $natureattributes .= '<br />-Violation of Code of Conduct';
	if ($_POST['natureinjuryperson'] == "checked") $natureattributes .= '<br />-Injury caused by person';
	if ($_POST['natureinjurybuilding'] == "checked") $natureattributes .= '<br />-Injury caused by building problem (wet floor, etc.)';
	if ($_POST['natureunaccompanied'] == "checked") $natureattributes .= '<br />-Unaccompanied minors';
	if ($_POST['natureunauthorized'] == "checked") $natureattributes .= '<br />-Unauthorized presence in building';
	if ($_POST['natureother'] == "checked") $natureattributes .= '<br />-Other';
	if ($natureattributes == "") $natureattributes .= '** None Selected **';
	if ($natureattributes == NULL) $natureattributes .= '** None Selected **';

	$htmlemailbody .= '<br /><table border="0" cellpadding="3" cellspacing="0">
  	<tr><td><strong>Nature of Incident:</strong>' . $natureattributes . '</td>
  	</tr></table>';

	// Description Block
	    $htmlemailbody .="<br />";

	/* if ($_POST[descriptionna] == "checked") {

		$htmlemailbody .= '<table border="0" cellpadding="3" cellspacing="0">';
		$htmlemailbody .= '<tr><td><strong>Description of perpetrator:</strong> Not Available';
		$htmlemailbody .= '</tr></td><tr><td>';
		if ($_POST[descriptionname] == "") $_POST[descriptionname] = "** No Entry **";
		if ($_POST[descriptionname] == NULL) $_POST[descriptionname] = "** No Entry **";
		$htmlemailbody .= 'Name (if known): ' . $_POST[descriptionname];
		$htmlemailbody .= '</tr></td></table>';

	} else { */

		if ($_POST['descriptionother'] == NULL) $showlongd = 'no';
		if ($_POST['descriptionother'] == "") $showlongd = 'no';
		if ($showlongd == 'no') {

			$longd = 'None';

		} else {

			$longd = '<br />' . nl2br($_POST['descriptionother']);

		}

		$htmlemailbody .= '<table border="1" cellpadding="3" cellspacing="0">
		<tr><td colspan="3"><strong>Description of perpetrator:</strong></td></tr>
		<tr><td colspan="3">Name (if known): ' . $_POST['descriptionname'] . '</td></tr>
		<tr><td>Sex: ' . $_POST['descriptionsex'] . '</td><td>Race: ' . $_POST['descriptionrace'] . '
		</td><td>Shirt: ' . $_POST['descriptionshirt'] . '</td></tr>
		<tr><td>Height: ' . $_POST['descriptionheight'] . '</td><td>
		Age: ' . $_POST['descriptionage'] . '</td><td>
		Pants/shorts/skirt: ' . $_POST['descriptionpants'] . '</td></tr>
		<tr><td>Weight: ' . $_POST['descriptionweight'] . '</td>
		<td>Hair Color: ' . $_POST['descriptionhair'] . '</td>
		<td>Coat: ' . $_POST['descriptioncoat'] . '</td></tr>
		<tr><td>Build: ' . $_POST['descriptionbuild'] . '</td>
		<td>Glasses: ' . $_POST['descriptionglasses'] . '</td><td>&nbsp;</td></tr>
		<tr><td colspan="3">Other description or distinguishing features: '
		. $longd . '</td></tr></table>';

	/* } */

	// Long Description Block
	$htmlemailbody .= '<br /><table border="0" cellpadding="3" cellspacing="0">
  	<tr><td><strong>Description of incident (to be completed by victim/witness, when possible; include anything the perpetrator said or did; LISTS of facts are preferred to NARRATIVE description):</strong><br />
	<br />' . nl2br($_POST['longdescription']) . '</td></tr></table>';

	// Previous Incidents Block
	if ($_POST['PrevIncidentYN'] == 'No') $prevyntext = 'No';
	if ($_POST['PrevIncidentYN'] == 'Yes') $prevyntext = 'Yes: ' . nl2br($_POST['previousincidentdescription']);

	$htmlemailbody .= '<br /><table border="0" cellpadding="3" cellspacing="0">
	<tr><td><strong>Have there been previous incidents involving this person? (If yes, describe).</strong></td></tr>
    <tr><td>' . $prevyntext . '</td></tr></table>';

	// Person Reporting Block
	if ($_POST['PersonStatusGroup'] == 'other') {
		$groupoutputtext = 'other: ' . $_POST['personotherexplain'];
	} else {
		$groupoutputtext = $_POST['PersonStatusGroup'];
	}

	if ($_POST['personcompleting'] == '' || $_POST['personcompleting'] == NULL) {
		$personcompletingoutput = '** No Entry **';
	} else {
		$personcompletingoutput = $_POST['personcompleting'];
	}

	$htmlemailbody .= '<br /><table border="0" cellpadding="3" cellspacing="0">
  	<tr><td colspan="3"><strong>Person reporting incident:</strong></td></tr>
  	<tr><td>Name: ' . $_POST['personname'] . '</td>
    <td>Phone: ' . $_POST['personphone'] . '</td>
    <td>Email: ' . $_POST['personemail'] . '</td></tr>
  	<tr><td colspan="3">Status: ' . $groupoutputtext . '</td></tr>
  	<tr><td colspan="3">Person completing this form (if different from above): ' . $personcompletingoutput . '</td></tr></table>';

	// Responding Officer/Party Block
	$htmlemailbody .= '<br /><table border="0" cellpadding="3" cellspacing="0">
  	<tr><td colspan="4"><strong>Responding Officer/Party (if applicable)</strong></td></tr>
  	<tr><td>Title/name: ' . $_POST['respondingtitlename'] . '</td>
    <td>Phone: ' . $_POST['respondingphone'] . '</td>
    <td>Time called: ' . $_POST['respondingtimecalled'] . '</td>
    <td>Time arrived: ' . $_POST['respondingtimearrived'] . '</td></tr></table>';

	// Witness Block
	if ($_POST['witnessname1'] == '' && $_POST['witnessphone1'] == '' && $_POST['witnesswilling1'] == '') {

		$htmlemailbody .= '<br /><table border="1" cellpadding="3" cellspacing="0">
		<tr><td><strong>Witness(es):</strong></td></tr>
		<tr><td>** No Entry **</td></tr></table>';

	} else {

		$htmlemailbody .= '<br /><table border="1" cellpadding="3" cellspacing="0">
		<tr><td colspan="3"><strong>Witness(es):</strong></td></tr>
		<tr><td>Name: ' . $_POST['witnessname1'] . '</td>
		<td>Phone: ' . $_POST['witnessphone1'] . '</td>
		<td>Willing to Report: ' . $_POST['witnesswilling1'] . '</td></tr>';

		if ($_POST['witnessadditional1'] == 'checked') {

			$htmlemailbody .= '<tr><td>Name: ' . $_POST['witnessname2'] . '</td>
			<td>Phone: ' . $_POST['witnessphone2'] . '</td>
			<td>Willing to Report: ' . $_POST['witnesswilling2'] . '</td></tr>';

		}

		if ($_POST['witnessadditional2'] == 'checked') {

			$htmlemailbody .= '<tr><td>Name: ' . $_POST['witnessname3'] . '</td>
			<td>Phone: ' . $_POST['witnessphone3'] . '</td>
			<td>Willing to Report: ' . $_POST['witnesswilling3'] . '</td></tr>';

		}

		$htmlemailbody .= '</table>';

	}

	// Bottom Text Block
	$htmlemailbody .= '<br /><table border="0" cellpadding="3" cellspacing="0">
	<tr><td><strong>
	The University Libraries thanks you for taking the time to complete this form. If additional details come to mind, please do not hesitate to amend your responses.</strong>
	</td></tr></table>';

	// Department Head Review Block
	$htmlemailbody .= '<br /><table border="1" cellpadding="3" cellspacing="0">
  	<tr>
    <td><strong>Department Head Review: </strong> Initial: ____________ Date: ____/____/____</td>
  	</tr></table>
	<table border="0" cellpadding="3" cellspacing="0"><tr><td>Follow up:<br />
	Action taken by:</td></tr></table>';

// Setup email ($incidentemail)

	$incidentemail = new PHPMailer();
	$incidentemail->IsSMTP();
	$incidentemail->IsHTML(true);

	// NOTE: smtp.ua.edu requires @ua.edu or @bama.ua.edu addresses be used
	$incidentemail->Host="smtp.ua.edu";

	// FROM: Business Office
	$incidentemail->From="kgibson@ua.edu";
	$incidentemail->FromName="UA Libraries Incident Report Submission";

	// UNCOMMENT FOR TEST MODE ONLY (Email Jennifer)
	//$incidentemail->AddAddress("jtillis@ua.edu", "Jennifer Tillis");
	//$incidentemail->AddAddress("cewyatt@ua.edu", "Caryl");
	//$incidentemail->AddAddress("jrmichelich@ua.edu", "James");
	//$incidentemail->AddAddress("sjturner1@ua.edu", "Steven Turner");

	// TO: Dean Gilstrap (dlgilstrap@ua.edu)
	$incidentemail->AddAddress("dlgilstrap@ua.edu", "Donald Gilstrap");

	// CC: Business Office
	$incidentemail->AddCC("kgibson@ua.edu", "Kara Gibson");
	$incidentemail->AddCC("lrweaver2@ua.edu", "Lane Weaver");

	// CC: Associate Deans
  $incidentemail->AddCC("maarthur@ua.edu", "Michael Arthur");
  $incidentemail->AddCC("endecker@ua.edu", "Emily Decker");
  $incidentemail->AddCC("kchapman@ua.edu", "Karen Chapman");
  // added emily on aug 14 2019

	$incidentemail->Subject="UA Libraries Incident Report Submission";
	$incidentemail->Body=$htmlemailbody;

	// CC to email address entered into (emailaddressalso) $newcleanemail and CC if necessary
	if (!empty($newcleanemail)) {
		$incidentemail->AddCC($newcleanemail);
	}

	// Determine CC by Location
	switch ($_POST['reportlocation']) {
	case "Gorgas":
		$incidentemail->AddCC("cdavis@ua.edu", "Cornelia Davis");
    break;
	case "Bruno":
		$incidentemail->AddCC("kchapman@ua.edu", "Karen Chapman");
		break;
	case "Hoole":
		$incidentemail->AddCC("dfwalton@ua.edu", "Donnelly Walton");
    $incidentemail->AddCC("lmadway@ua.edu", "Lorraine Madway");
		break;
	case "McLure":
    // $incidentemail->AddCC("bstrnad@ua.edu", "Benita Strnad");
    $incidentemail->AddCC("kchapman@ua.edu", "Karen Chapman");
    $incidentemail->AddCC("dminor@ua.edu", "Donna Minor");
		break;
	case "Rodgers":
    $incidentemail->AddCC("kchapman@ua.edu", "Karen Chapman");
    $incidentemail->AddCC("dminor@ua.edu", "Donna Minor");
		break;
  case "Annex":
    $incidentemail->AddCC("bdahlbac@ua.edu", "Barbara Dahlbach");
		break;

	}


	}

?><?php
	if ($formhaserrors == 0) {

	if(!$incidentemail->Send()) {
		echo "<p>There was an SMTP (mail server) error while sending your report submission. Please click the back button in your browser and attempt to send the report again.<br /><br />";
		echo "Error: " . $incidentemail->ErrorInfo;
		echo "</p>";
		// echo '<div align="center"><a href="index.php">Return to Error Report Submission Page</a></div>';
		exit;
	}

	// Display success message (success.html)
	echo 'Thank you for submitting an Incident Report.<br /><br />
	The report has been sent to the Business Office and appropriate department head(s). If
	you have any questions or need to follow up with any additional information, please
	<a href="mailto:kgibson@ua.edu">contact the UAL business office</a>.<br />

	<p align="center">
	<a href="/intranet/">Return to Intranet Home</a>
	</p>';

	} else {

		// Display filter failure message (badfiltertext.html)

		echo '<h2>Report Submission Error</h2>
		<p>The following entry errors were detected in your Incident Report submission:</p>';

		echo '<p><div style="color:#990000">' . $formerrorlist . '</div></p>';

		echo '<br /><br /><p>Please click the "Back" button in your browser and correct these errors.<br/>';
		echo 'Once corrected, click the "Submit Report" button to again attempt to send the Incident Report.</p>';

	}

?>

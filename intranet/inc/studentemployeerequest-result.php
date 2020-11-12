<div>
	<br />
	<?php

// Require PHP Mailer
  /* require("sites/intranet.lib.ua.edu/files/incidentreport/class.phpmailer.php"); */

// Set valid referers
  $valid_referers=array(
  "http://wwwdev2.lib.ua.edu/intranet/studentemployeerequest",
  "http://wwwdev2.lib.ua.edu/intranet/studentemployeerequest/",
  "https://wwwdev2.lib.ua.edu/intranet/studentemployeerequest",
  "https://wwwdev2.lib.ua.edu/intranet/studentemployeerequest/");

// Test for required fields and filter email entry fields
  $bad_happened = 0;
  $submit_error_list = '';

// Check for blank entry
  if (empty($_POST['positionType']) && empty($_POST['dept']) && empty($_POST['super']) && empty($_POST['superEmail']) && empty($_POST['position']) && empty($_POST['start']) && empty($_POST['rate']) && empty($_POST['schedule']) && empty($_POST['required']) && empty($_POST['skills']) && empty($_POST['preferred']) && empty($_POST['summary'])) {
    $bad_happened = 1;
    $submit_error_list .= ' - No data entered<br />';
  }

// Check for single and correctly formatted email address in email field
  if ($bad_happened != 1) {

    if ($_POST['PatronEmail']) {
      $newcleanemail = filter_var($_POST['PatronEmail'], FILTER_SANITIZE_EMAIL);
      if(filter_var($newcleanemail, FILTER_VALIDATE_EMAIL) === FALSE)  {
        $bad_happened = 1;
        $submit_error_list .= " - Invalid email address in 'E-mail address' field<br />";
      } else {
        $_POST['PatronEmail'] = $newcleanemail;
      }
    }
  }

// Test for valid referer
  if ($bad_happened != 1) {
    $good_referer = 0;
    foreach ($valid_referers as $value)
	{
		if (strpos(" " . $_SERVER['HTTP_REFERER'],$value) > 0) {
			$good_referer = 1;
		}
	}

	// If no good referer found, set bad_happened to 1
	if ($good_referer == 0) {
		$bad_happened = 1;
		error_log("CIRC-TRACE-FORM: Bad Referer: " . $_SERVER['HTTP_REFERER']);
	}

  }

// Sanitize all fields
  if ($bad_happened != 1) {
  $_POST['positionType'] = filter_var($_POST['positionType'], FILTER_SANITIZE_STRING);
  $_POST['dept'] = filter_var($_POST['dept'], FILTER_SANITIZE_STRING);
  $_POST['super'] = filter_var($_POST['super'], FILTER_SANITIZE_STRING);
  $_POST['superEmail'] = filter_var($_POST['superEmail'], FILTER_SANITIZE_STRING);
  $_POST['position'] = filter_var($_POST['position'], FILTER_SANITIZE_STRING);
  $_POST['start'] = filter_var($_POST['start'], FILTER_SANITIZE_STRING);
  $_POST['rate'] = filter_var($_POST['rate'], FILTER_SANITIZE_STRING);
  $_POST['apptType'] = filter_var($_POST['apptType'], FILTER_SANITIZE_STRING);
  $_POST['schedule'] = filter_var($_POST['schedule'], FILTER_SANITIZE_STRING);
  $_POST['required'] = filter_var($_POST['required'], FILTER_SANITIZE_STRING);
	$_POST['skills'] = filter_var($_POST['skills'], FILTER_SANITIZE_STRING);
	$_POST['preferred'] = filter_var($_POST['preferred'], FILTER_SANITIZE_STRING);
	$_POST['summary'] = filter_var($_POST['summary'], FILTER_SANITIZE_STRING);
  }

// Prepare Output
  if ($bad_happened != 1) {

    $fullemailbody =  "********* Student Employee Request Form *********" . PHP_EOL . PHP_EOL;
    $fullemailbody .= "**************************" . PHP_EOL;
    $fullemailbody .= "Position Type: " . $_POST['positionType'] . PHP_EOL;
    $fullemailbody .= "Department: " . $_POST['dept'] . PHP_EOL;
    $fullemailbody .= "Student Supervisor: " . $_POST['super'] . PHP_EOL;
    $fullemailbody .= "Supervisor Email Address: " . $_POST['superEmail'] . PHP_EOL;
    $fullemailbody .= "Position Title: " . $_POST['position'] . PHP_EOL;
    $fullemailbody .= "Expected Start Date: " . $_POST['start'] . PHP_EOL;
    $fullemailbody .= "Hiring Rate: " . $_POST['rate'] . PHP_EOL;
    $fullemailbody .= "Appointment Type: " . $_POST['apptType'] . PHP_EOL . PHP_EOL;
    $fullemailbody .= "Work Schedule: " . $_POST['schedule'] . PHP_EOL . PHP_EOL;
    $fullemailbody .= "Required Minimum Qualifications: " .$_POST['required'] . PHP_EOL . PHP_EOL;
    $fullemailbody .= "Skills and Knowledge: " .$_POST['skills'] . PHP_EOL . PHP_EOL;
    $fullemailbody .= "Preferred Qualifications: " .$_POST['preferred'] . PHP_EOL . PHP_EOL;
    $fullemailbody .= "Job Summary: " .$_POST['summary'] . PHP_EOL . PHP_EOL;
    $fullemailbody .= "**************************" . PHP_EOL . PHP_EOL;
    $fullemailbody .= "REFERER: " . $_SERVER['HTTP_REFERER'] . PHP_EOL;
    $fullemailbody .= "DATE/TIME: " . date("F j, Y, g:i a") . PHP_EOL . PHP_EOL;
    $fullemailbody .= "**************************" . PHP_EOL;

  }

// Setup email
  if ($bad_happened != 1) {

  // Setup email using PHP Mailer
    $mail = new PHPMailer();
    $mail->IsSMTP();
    $mail->Host = "smtp.ua.edu";
    $mail->From = $_POST['superEmail'];
    $mail->FromName = $_POST['super'];
    $mail->Subject = "Student Employee Job Request Form";
    $mail->Body    = $fullemailbody;

		$mail->AddAddress("mljackson@ua.edu", "Millie Jackson");
		// FOR DEV ONLY:
    //$mail->AddAddress("cewyatt@ua.edu", "caryl");
    //$mail->AddAddress("jrmichelich@ua.edu", "james");

  }

// Print result

  if (($bad_happened == 1) && ($submit_error_list)) {
    print '<h2>Trace Form Submission Error</h2>
    <p>The following entry errors were detected in your Trace Form submission:</p>';
    print '<p><div style="color:#990000">' . $submit_error_list . '</div></p>';
    print '<br /><br /><p>Please click the "Back" button in your browser and correct these errors.<br/>';
    print 'Once corrected, click the "Submit Form" button to again attempt to send the Trace Form.</p>';
  }
  elseif (($bad_happened == 1) && ($good_referer == 0)) {
    print "<h2>Bad Referer - Cannot Proceed</h2>";
    print "<p>Your submittion came from an invalid location.</p>";
    print "<p>Please follow this link to submit the report from the correct location:<br /><br />";
    print '<a href="/departments/hr/forms/studentemployeerequest">Student Employee Job Request Form</a></p><br />';
  }
  else {
    // No error condition - attempt to send email
    if(!$mail->Send()) {
      echo "<h2>Mail Send Error</h2>";
      echo "<p>There was an SMTP (mail server) error while sending your request.</p>";
      echo "<p>Please click the back button in your browser and attempt to send the request again.<br /><br />";
      echo "Error: " . $mail->ErrorInfo;
      echo "</p><br />";
      error_log("CIRC-TRACE-FORM: SMTP Error: " . $mail->ErrorInfo);
    } else {
      // Success message
      print '<h2>Message Sent</h2>';
      print '<p>Your Student Employee Job Request Form has been sent to Dr. Millie Jackson.<br /><br />';
      print '<br /><p align="center"><a href="/intranet/">Return to Intranet Home</a></p>';
    }
  }

?></div>

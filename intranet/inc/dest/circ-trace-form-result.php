	<?php

// Require PHP Mailer
  //require("wp-content/themes/ua-theme-child/assets/incidentreport/class.phpmailer.php");

// Set valid referers
  $valid_referers=array(
  "http://www.lib.ua.edu/intranet/circ-trace-form",
  "http://www.lib.ua.edu/intranet/circ-trace-form/",
  "https://www.lib.ua.edu/intranet/circ-trace-form",
  "https://www.lib.ua.edu/intranet/circ-trace-form/");

// Test for required fields and filter email entry fields
  $bad_happened = 0;
  $submit_error_list = '';

// Check for blank entry
  if (empty($_POST['callnum']) && empty($_POST['title']) && empty($_POST['barcode']) && empty($_POST['patronName']) && empty($_POST['PatronEmail']) && empty($_POST['PatronPhone']) && empty($_POST['neededBy']) && empty($_POST['Info'])) {
    $bad_happened = 1;
    $submit_error_list .= ' - No data entered';      
  }

// Check for single and correctly formatted email address in email field
  if ($bad_happened != 1) {
    
    if ($_POST['PatronEmail']) {
      $newcleanemail = filter_var($_POST['PatronEmail'], FILTER_SANITIZE_EMAIL);
      if(filter_var($newcleanemail, FILTER_VALIDATE_EMAIL) === FALSE)  {
        $bad_happened = 1;
        $submit_error_list .= " - Invalid email address in 'E-mail address' field";
      } else {
        $_POST['PatronEmail'] = $newcleanemail;
      }
    }
  }

// Check for data in required fields
  if ($bad_happened != 1) {

    // patronName
    if (empty($_POST['personsubmit'])) {
      $bad_happened = 1;
      $submit_error_list .= ' - No Person Submitting Name Entered';
    }   

    // patronName
    if (empty($_POST['patronName'])) {
      $bad_happened = 1;
      $submit_error_list .= ' - No Patron Name Entered';
    }        

    // PatronEmail
    if (empty($_POST['PatronEmail'])) {
      $bad_happened = 1;
      $submit_error_list .= ' - No BAMA Email Address Entered';
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
  $_POST['personsubmit'] = filter_var($_POST['personsubmit'], FILTER_SANITIZE_STRING);
  $_POST['callnum'] = filter_var($_POST['callnum'], FILTER_SANITIZE_STRING);
  $_POST['title'] = filter_var($_POST['title'], FILTER_SANITIZE_STRING);
  $_POST['barcode'] = filter_var($_POST['barcode'], FILTER_SANITIZE_STRING);
  $_POST['patronName'] = filter_var($_POST['patronName'], FILTER_SANITIZE_STRING);
  $_POST['PatronEmail'] = filter_var($_POST['PatronEmail'], FILTER_SANITIZE_STRING);
  $_POST['PatronPhone'] = filter_var($_POST['PatronPhone'], FILTER_SANITIZE_STRING);
  $_POST['status'] = filter_var($_POST['status'], FILTER_SANITIZE_STRING);
  $_POST['neededBy'] = filter_var($_POST['neededBy'], FILTER_SANITIZE_STRING);
  $_POST['info'] = filter_var($_POST['info'], FILTER_SANITIZE_STRING);
  }

// Prepare Output
  if ($bad_happened != 1) {

    $fullemailbody =  "********* Online Trace Form *********" . PHP_EOL . PHP_EOL;
    $fullemailbody .= "**************************" . PHP_EOL;
    $fullemailbody .= "Online Trace Details" . PHP_EOL;
    $fullemailbody .= "**************************" . PHP_EOL;
    $fullemailbody .= "DATE/TIME: " . date("F j, Y, g:i a") . PHP_EOL;
    $fullemailbody .= "SUBMITTED BY: " . $_POST['personsubmit'] . PHP_EOL;
    $fullemailbody .= "CALL NUMBER: " . $_POST['callnum'] . PHP_EOL;
    $fullemailbody .= "TITLE: " . $_POST['title'] . PHP_EOL;
    $fullemailbody .= "BARCODE: " . $_POST['barcode'] . PHP_EOL;
    $fullemailbody .= "PATRON NAME: " . $_POST['patronName'] . PHP_EOL;
    $fullemailbody .= "PATRON EMAIL: " . $_POST['PatronEmail'] . PHP_EOL;
    $fullemailbody .= "PATRON PHONE: " . $_POST['PatronPhone'] . PHP_EOL;
    $fullemailbody .= "UNIVERSITY STATUS: " . $_POST['status'] . PHP_EOL;
    $fullemailbody .= "DATE NEEDED BY: " . $_POST['neededBy'] . PHP_EOL;
    $fullemailbody .= "ADDITIONAL INFO: " .$_POST['Info'] . PHP_EOL;
    $fullemailbody .= "   REFERER: " . $_SERVER['HTTP_REFERER'] . PHP_EOL;
    $fullemailbody .= "USER AGENT: " . $_SERVER['HTTP_USER_AGENT'] . PHP_EOL . PHP_EOL;
    $fullemailbody .= "**************************" . PHP_EOL;
    $fullemailbody .= "Trace Report" . PHP_EOL;
    $fullemailbody .= "***************************************************************************************************************" . PHP_EOL . PHP_EOL;
    $fullemailbody .= "     Outcome of this trace: ___________________________________________________________________________________" . PHP_EOL . PHP_EOL;
    $fullemailbody .= "     __________________________________________________________________________________________________________" . PHP_EOL . PHP_EOL;
    $fullemailbody .= "     __________________________________________________________________________________________________________" . PHP_EOL . PHP_EOL;
    $fullemailbody .= "***************************************************************************************************************" . PHP_EOL;
  }

// Setup email
  if ($bad_happened != 1) {

  // Setup email using PHP Mailer
    $mail = new PHPMailer();
    $mail->IsSMTP();
    $mail->Host = "smtp.ua.edu";
    $mail->From = 'circmail@bama.ua.edu';
    $mail->FromName = 'Online Trace Form';
    // $mail->AddAddress("bbrosier@ua.edu", "Barbara Brosier");
    // $mail->AddAddress("jtillis@ua.edu", "Jennifer Tillis");
    $mail->Subject = "Online Trace Form - " . $_POST['whichlibrary'] . " Circ Desk";
    $mail->Body    = $fullemailbody;

    if ($_POST['whichlibrary'] == 'Gorgas') {
      $mail->AddAddress("cewyatt@ua.edu", "caryl");
    }

    if ($_POST['whichlibrary'] == 'Rodgers') {
      $mail->AddAddress("cewyatt@ua.edu", "caryl");
    }

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
    print '<a href="/departments/circulation/forms/onlinetraceform">Circulation - Online Trace Form</a></p><br />';
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
      print '<p>Your Trace Form has been sent to the appropriate persons.<br /><br />';
      print '<br /><p align="center"><a href="/">Return to Intranet Home</a></p>';
    }
  }

?>


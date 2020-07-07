	<?php

  // Set valid referers
  $valid_referers=array(
  "http://appsdev.lib.ua.edu/blogs/intranet/actcardform",
  "http://appsdev.lib.ua.edu/blogs/intranet/actcardform/",
  "https://appsdev.lib.ua.edu/blogs/intranet/actcardform",
  "https://appsdev.lib.ua.edu/blogs/intranet/actcardform/");

  // Require PHP Mailer
  /* require("sites/intranet.lib.ua.edu/files/incidentreport/class.phpmailer.php"); */

  // Test for required fields and filter email entry fields
  $bad_happened = 0;
  $submit_error_list = '';

    // Check for blank entry
    if (empty($_POST["CircOperator"]) && empty($_POST["OperatorEmail"]) && empty($_POST["ReaderMSG"]) && empty($_POST["PatronName"]) && empty($_POST["PatronCWID"]) && empty($_POST["PatronEmail"]) && empty($_POST["PatronPhone"]) && empty($_POST["Info"])) {
        $bad_happened = 1;
        $submit_error_list .= ' - No data entered<br />';      
      }

    // Check for single and correctly formatted email address in email fields
      if ($_POST['OperatorEmail']) {
        $newcleanemail = filter_var($_POST['OperatorEmail'], FILTER_SANITIZE_EMAIL);
        if(filter_var($newcleanemail, FILTER_VALIDATE_EMAIL) === FALSE)  {
          $bad_happened = 1;
          $submit_error_list .= " - Invalid email address in 'Operator Email' field<br />";
        } else {
          $_POST['OperatorEmail'] = $newcleanemail;
        }
      }

      if ($_POST['PatronEmail']) {
        $newcleanemail = filter_var($_POST['PatronEmail'], FILTER_SANITIZE_EMAIL);
        if(filter_var($newcleanemail, FILTER_VALIDATE_EMAIL) === FALSE)  {
          $bad_happened = 1;
          $submit_error_list .= " - Invalid email address in 'Patron Email' field<br />";
        } else {
          $_POST['PatronEmail'] = $newcleanemail;
        }
      }

  // Test for valid referer
  if ($bad_happened == 0) {
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
		error_log("ACTION-CARD-REPORT: Bad Referer: " . $_SERVER['HTTP_REFERER']);
	}

  }

  // Sanitize all fields
  if (bad_happened == 0) {
  $_POST['CircDesk'] = filter_var($_POST['CircDesk'], FILTER_SANITIZE_STRING);
  $_POST['CircOperator'] = filter_var($_POST['CircOperator'], FILTER_SANITIZE_STRING);
  $_POST['OperatorEmail'] = filter_var($_POST['OperatorEmail'], FILTER_SANITIZE_STRING);
  $_POST['ReaderMSG'] = filter_var($_POST['ReaderMSG'], FILTER_SANITIZE_STRING);
  $_POST['PatronName'] = filter_var($_POST['PatronName'], FILTER_SANITIZE_STRING);
  $_POST['PatronCWID'] = filter_var($_POST['PatronCWID'], FILTER_SANITIZE_STRING);
  $_POST['PatronEmail'] = filter_var($_POST['PatronEmail'], FILTER_SANITIZE_STRING);
  $_POST['PatronPhone'] = filter_var($_POST['PatronPhone'], FILTER_SANITIZE_STRING);
  $_POST['Info'] = filter_var($_POST['Info'], FILTER_SANITIZE_STRING);
  }

  // Prepare output
  if (bad_happened == 0) {
    $fullemailbody = "*********Action Card Scan Problem Report*********" . PHP_EOL;
    $fullemailbody .= "******************************" . PHP_EOL;
    $fullemailbody .= "Report Submission Details" . PHP_EOL;
    $fullemailbody .= "******************************" . PHP_EOL;
    $fullemailbody .= " DATE/TIME: " . date("F j, Y, g:i a") . PHP_EOL;
    $fullemailbody .= "  CIRCDESK: " . $_POST[CircDesk] . PHP_EOL;
    $fullemailbody .= "  OPERATOR: " . $_POST[CircOperator] . PHP_EOL;
    $fullemailbody .= "OPER EMAIL: " . $_POST[OperatorEmail] . PHP_EOL;
    $fullemailbody .= "IP ADDRESS: " . $_SERVER['REMOTE_ADDR'] . PHP_EOL;
    $fullemailbody .= "   REFERER: " . $_SERVER['HTTP_REFERER'] . PHP_EOL;
    $fullemailbody .= "USER AGENT: " . $_SERVER['HTTP_USER_AGENT'] . PHP_EOL;
    $fullemailbody .= "******************************" . PHP_EOL;
    $fullemailbody .= "Patron Information" . PHP_EOL;
    $fullemailbody .= "******************************" . PHP_EOL;
    $fullemailbody .= " PATRON NAME: " . $_POST[PatronName] . PHP_EOL;
    $fullemailbody .= " PATRON CWID: " . $_POST[PatronCWID] . PHP_EOL;
    $fullemailbody .= "PATRON EMAIL: " . $_POST[PatronEmail] . PHP_EOL;
    $fullemailbody .= "PATRON PHONE: " . $_POST[PatronPhone] . PHP_EOL;
    $fullemailbody .= "CARD READER MESSAGE: " . $_POST[ReaderMSG] . PHP_EOL;
    $fullemailbody .= "ADDITIONAL INFO: " . $_POST[Info] . PHP_EOL;
    $fullemailbody .= "******************************" . PHP_EOL;
    $fullemailbody .= "OLT Use Only" . PHP_EOL;
    $fullemailbody .= "******************************" . PHP_EOL;
    $fullemailbody .= "     DATE RECEIVED: __________________" . PHP_EOL . PHP_EOL;
    $fullemailbody .= "        RESOLUTION: _________________________________________________" . PHP_EOL . PHP_EOL;
    $fullemailbody .= "   PATRON NOTIFIED: Date: _________________ By: _____________________" . PHP_EOL . PHP_EOL;
    $fullemailbody .= "CIRC OPER NOTIFIED: Date: _________________ By: _____________________" . PHP_EOL;
    $fullemailbody .= " " . PHP_EOL;
    $fullemailbody .= "REMEMBER TO PUT POP-UP MESSAGE ON PATRONS VOYAGER RECORD!" . PHP_EOL;
    $fullemailbody .= "******************************" . PHP_EOL;
  }

  // Setup email using PHP Mailer
    $mail = new PHPMailer();
    $mail->IsSMTP();
    $mail->Host = "smtp.ua.edu";
    $mail->From = $_POST[OperatorEmail];
    $mail->FromName = $_POST[CircOperator];
    /* $mail->AddAddress("mpatrick@lib.ua.edu", "Michael Patrick"); */
    $mail->AddAddress("cewyatt@ua.edu", "caryl");
    /* $mail->AddCC("ierm@ua.edu", "ILS & E-Resource Management"); */
    #$mail->AddCC("libsys@bama.ua.edu", "Libsys");
    # $mail->AddAddress("jtillis@ua.edu", "Jennifer Tillis");
    $mail->Subject = "Action Card Scan Problem Report - " . $_POST[CircDesk] . " Circ Desk";
    $mail->Body    = $fullemailbody;

  // Handle Errors and Output Message to User
  if ($submit_error_list) {
    print '<h2>Report Submission Error</h2>
    <p>The following entry errors were detected in your Action Card Scan Problem Report submission:</p>';
    print '<p><div style="color:#990000">' . $submit_error_list . '</div></p>';
    print '<br /><br /><p>Please click the "Back" button in your browser and correct these errors.<br/>';
    print 'Once corrected, click the "Submit Report" button to again attempt to send the Problem Report.</p>';
  }
  elseif ($good_referer == 0) {
    print "<h2>Bad Referer - Cannot Proceed</h2>";
    print "<p>Your submittion came from an invalid location.</p>";
    print "<p>Please follow this link to submit the report from the correct location:<br /><br />";
    print '<a href="/departments/systems/forms/ActCardForm">Action Card Scan Problem Report</a></p><br />';
  }
  else {
    // No error condition - attempt to send email
    if(!$mail->Send()) {
      echo "<h2>Mail Send Error</h2>";
      echo "<p>There was an SMTP (mail server) error while sending your report.</p>";
      echo "<p>Please click the back button in your browser and attempt to send the report again.<br /><br />";
      echo "Error: " . $mail->ErrorInfo;
      echo "</p><br />";
      error_log("ACTION-CARD-REPORT: SMTP Error: " . $mail->ErrorInfo);
    } else {
      // Success message
      print '<h2>Message Sent</h2>';
      print '<p>The patron will be contacted when the problem is resolved.<br /><br />';
      print '<br /><p align="center"><a href="/">Return to Intranet Home</a></p>';
    }

  }

?>


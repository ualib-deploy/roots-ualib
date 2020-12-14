	<?php

if ( ! function_exists( 'wp_handle_upload' ) ) {
    require_once( ABSPATH . 'wp-admin/includes/file.php' );
}

// Set valid referers
  $valid_referers=array(
  "http://www.lib.ua.edu/intranet/tech-request-form",
  "http://www.lib.ua.edu/intranet/tech-request-form/",
  "https://www.lib.ua.edu/intranet/tech-request-form",
  "https://www.lib.ua.edu/intranet/tech-request-form/");

// Test for required fields and filter email entry fields
  $bad_happened = 0;
  $submit_error_list = '';

// Check for blank entry
  // left out requester and email since they will pre-fill from WP user data
  // left out request type since it has to be one of three things
  if (empty($_POST['department']) && empty($_POST['description']) && empty($_POST['itemType']) && empty($_POST['purpose']) && empty($_POST['costEstimate']) && empty($_POST['imageUpload'])) {
    $bad_happened = 1;
    $submit_error_list .= ' - No data entered';
  }

// Check for single and correctly formatted email address in email field
  if ($bad_happened != 1) {

    if ($_POST['email']) {
      $newcleanemail = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
      if(filter_var($newcleanemail, FILTER_VALIDATE_EMAIL) === FALSE)  {
        $bad_happened = 1;
        $submit_error_list .= " - Invalid email address in 'E-mail address' field";
      } else {
        $_POST['email'] = $newcleanemail;
      }
    }
  }

// Check for data in required fields
  if ($bad_happened != 1) {

    // should be WP username, but that could be overwritten
    if (empty($_POST['requester'])) {
      $bad_happened = 1;
      $submit_error_list .= ' - No Requester Name Entered';
    }

    // department
    if (empty($_POST['department'])) {
      $bad_happened = 1;
      $submit_error_list .= ' - No Department Entered';
    }

    // description
    if (empty($_POST['description'])) {
      $bad_happened = 1;
      $submit_error_list .= ' - No Description Entered';
    }

    // type of item
    if (empty($_POST['itemType'])) {
      $bad_happened = 1;
      $submit_error_list .= ' - No Type of Item Entered';
    }

    // purpose
    if (empty($_POST['purpose'])) {
      $bad_happened = 1;
      $submit_error_list .= ' - No Purpose Entered';
    }

    // cost estimate
    if (empty($_POST['costEstimate'])) {
      $bad_happened = 1;
      $submit_error_list .= ' - No Cost Estimate Entered';
    }

      if(isset($_FILES['imageUpload'])){
        $tiff = $_FILES['imageUpload'];
        if($tiff['type'] !== 'image/tiff') {

            $bad_happened = 1;
            $submit_error_list .= 'Unsupported file type upload. Please submit .TIFF image.';

      } else {
          $overrides = array( 'test_form' => false);

          // Use the wordpress function to upload
          $uploaded=wp_handle_upload($tiff, $overrides);
          // Error checking using WP functions
          // update this conditional to $bad_happened instead of echo
            if(is_wp_error($uploaded)){
                    $bad_happened = 1;
                    $submit_error_list .= "Error uploading file (msg: ".$uploaded->get_error_message()."); please try again.";
                    echo "Error uploading file: " . $uploaded->get_error_message();
            }
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
		error_log("TECH-REQUEST-FORM: Bad Referer: " . $_SERVER['HTTP_REFERER']);
	}

  }

// Sanitize all fields
  if ($bad_happened != 1) {
  $_POST['requester'] = filter_var($_POST['requester'], FILTER_SANITIZE_STRING);
  $_POST['email'] = filter_var($_POST['email'], FILTER_SANITIZE_STRING);
  $_POST['department'] = filter_var($_POST['department'], FILTER_SANITIZE_STRING);
  $_POST['itemType'] = filter_var($_POST['itemType'], FILTER_SANITIZE_STRING);
  $_POST['description'] = filter_var($_POST['description'], FILTER_SANITIZE_STRING);
  $_POST['description'] = stripslashes($_POST['description']);
  $_POST['purpose'] = filter_var($_POST['purpose'], FILTER_SANITIZE_STRING);
  $_POST['purpose'] = stripslashes($_POST['purpose']);
  $_POST['costEstimate'] = filter_var($_POST['costEstimate'], FILTER_SANITIZE_STRING);
  }

// Prepare Output

  //set timezone
  date_default_timezone_set('America/Chicago');
  if ($bad_happened != 1) {

    $fullemailbody =  "********* Technology Request Form *********" . PHP_EOL . PHP_EOL;
    $fullemailbody .= "DATE/TIME: " . date("F j, Y, g:i a") . PHP_EOL;
    $fullemailbody .= "REQUESTER: " . $_POST['requester'] . PHP_EOL;
    $fullemailbody .= "USER EMAIL: " . $_POST['email'] . PHP_EOL;
    $fullemailbody .= "REQUESTING DEPARTMENT: " . $_POST['department'] . PHP_EOL;
    $fullemailbody .= "REQUEST TYPE: " . $_POST['requestType'] . PHP_EOL;
    $fullemailbody .= "DESCRIPTION: " . htmlspecialchars_decode($_POST['description'], ENT_QUOTES) . PHP_EOL;
    $fullemailbody .= "PURPOSE: " . htmlspecialchars_decode($_POST['purpose'], ENT_QUOTES) . PHP_EOL;
    $fullemailbody .= "COST ESTIMATE: " . $_POST['costEstimate'] . PHP_EOL;
  }

// Setup email
  if ($bad_happened != 1) {

  // Setup email using PHP Mailer
    $mail = new PHPMailer();
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';
    $mail->IsSMTP();
    $mail->Host = "smtp.ua.edu";
    $mail->From = $_POST['email'];
    $mail->FromName = 'Technology Request Form';
		$mail->AddAddress("libhelpdesk@ua.edu", "Library Help Desk");
		// FOR DEV ONLY:
    // $mail->AddAddress("cewyatt@ua.edu", "Caryl Wyatt");
		// $mail->AddAddress("jrmichelich@ua.edu", "James Michelich");
    // $mail->AddAddress("jtillis@ua.edu", "Jennifer Tillis");
    $mail->Subject = "TRF: ".$_POST['itemType'];
    $mail->Body    = $fullemailbody;
    $mail->AddAttachment($uploaded['file']);

  }

// Print result

  if (($bad_happened == 1) && ($submit_error_list)) {
    print '<h2>Technology Request Form Submission Error</h2>
    <p>The following entry errors were detected in your Technology Request Form submission:</p>';
    print '<p><div style="color:#990000">' . $submit_error_list . '</div></p>';
    print '<br /><br /><p>Please click the "Back" button in your browser and correct these errors.<br/>';
    print 'Once corrected, click the "Submit Form" button to again attempt to send the Technology Request Form.</p>';
  }
  elseif (($bad_happened == 1) && ($good_referer == 0)) {
    print "<h2>Bad Referer - Cannot Proceed</h2>";
    print "<p>Your submission came from an invalid location.</p>";
    print "<p>Please follow this link to submit the report from the correct location:<br /><br />";
    print '<a href="/intranet/tech-request-form/">Technology Request Form</a></p><br />';
  }
  else {
    // No error condition - attempt to send email
    if(!$mail->Send()) {
      echo "<h2>Mail Send Error</h2>";
      echo "<p>There was an SMTP (mail server) error while sending your request.</p>";
      echo "<p>Please click the back button in your browser and attempt to send the request again.<br /><br />";
      echo "Error: " . $mail->ErrorInfo;
      echo "</p><br />";
      error_log("TECH-REQUEST-FORM: SMTP Error: " . $mail->ErrorInfo);
    } else {
      // Success message
      print '<h2>Message Sent</h2>';
      print '<p>Your Technology Request Form has been sent to the appropriate persons.<br /><br />';
      print '<br /><p align="center"><a href="/intranet/">Return to Intranet Home</a></p>';
    }
  }

?>

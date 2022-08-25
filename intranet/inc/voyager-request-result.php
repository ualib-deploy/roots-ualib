	<?php

  // Set valid referers
  $valid_referers=array(
  "http://wwwdev2.lib.ua.edu/intranet/voyager-request",
  "http://wwwdev2.lib.ua.edu/intranet/voyager-request/",
  "https://wwwdev2.lib.ua.edu/intranet/voyager-request",
  "https://wwwdev2.lib.ua.edu/intranet/voyager-request/");

  // Require PHP Mailer
  /* require("sites/intranet.lib.ua.edu/files/incidentreport/class.phpmailer.php"); */

  // Test for required fields and filter email entry fields
  $bad_happened = 0;
  $submit_error_list = '';

    // Check for blank entry
    if (empty($_POST["RequestorName"])) {
        ++$bad_happened;
        $submit_error_list = 'Name is required<br />';
      }
    if (empty($_POST["RequestorEmail"])) {
        ++$bad_happened;
        $submit_error_list .= 'Email is required<br />';
      }
    if (empty($_POST["RequestorDept"])) {
        ++$bad_happened;
        $submit_error_list .= 'Department is required<br />';
      }
    if (empty($_POST["RequestorPhone"])) {
        ++$bad_happened;
        $submit_error_list .= 'Phone is required<br />';
      }
    if (empty($_POST["NeededBy"])) {
        ++$bad_happened;
        $submit_error_list .= 'Date report is needed by is required<br />';
      }
    if ($_POST['Frequency'] == ' ' || (empty($_POST['Frequency']))) {
        ++$bad_happened;
        $submit_error_list .= 'Frequency of report is required<br />';
      }
    if ($_POST['OutputFormat'] == ' ' || (empty($_POST['OutputFormat']))) {
        ++$bad_happened;
        $submit_error_list .= 'Output file format is required<br />';
      }
    if (empty($_POST["Description"])) {
        ++$bad_happened;
        $submit_error_list .= 'Report description is required<br />';
      }
    if (empty($_POST["LibraryLimit"])) {
        ++$bad_happened;
        $submit_error_list .= 'Please choose whether or not to limit by owning library<br />';
      }
    if (empty($_POST["LocationLimit"])) {
        ++$bad_happened;
        $submit_error_list .= 'Please choose whether or not to limit by location<br />';
      }
    if ($_POST['LocationLimit'] == 'Yes' && (empty($_POST['LocationOption']))) {
	++$bad_happened;
	$submit_error_list .= 'Please choose whether to Include or Exclude the selected locations<br />';
      }
    if (empty($_POST["TypeLimit"])) {
        ++$bad_happened;
        $submit_error_list .= 'Please choose whether or not to limit by item type<br />';
      }
    if ($_POST['TypeLimit'] == 'Yes' && (empty($_POST['TypeOption']))) {
	++$bad_happened;
	$submit_error_list .= 'Please choose whether to Include or Exclude the selected item types<br />';
      }
    if (empty($_POST["StatusLimit"])) {
        ++$bad_happened;
        $submit_error_list .= 'Please choose whether or not to limit by item status<br />';
      }
    if ($_POST['StatusLimit'] == 'Yes' && (empty($_POST['StatusOption']))) {
	++$bad_happened;
	$submit_error_list .= 'Please choose whether to Include or Exclude the selected item statuses<br />';
      }
    if (empty($_POST["SuppressedRecords"])) {
        ++$bad_happened;
        $submit_error_list .= 'Please choose whether or not to include suppressed records<br />';
      }
    if (empty($_POST["SortOutput"])) {
        ++$bad_happened;
        $submit_error_list .= 'Please choose whether or not to sort the final report<br />';
      }


    // Check for single and correctly formatted email address in email fields
      if ($_POST['RequestorEmail']) {
        $newcleanemail = filter_var($_POST['RequestorEmail'], FILTER_SANITIZE_EMAIL);
        if(filter_var($newcleanemail, FILTER_VALIDATE_EMAIL) === FALSE)  {
          ++$bad_happened;
          $submit_error_list .= "Invalid email address<br />";
        } else {
          $_POST['RequestorEmail'] = $newcleanemail;
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
		error_log("VOYAGER-REPORT-REQUEST: Bad Referer: " . $_SERVER['HTTP_REFERER']);
	}

  }

// Replace Newline with BR in Voyager Fields
$voyagerfields = " ";
if (!empty($_POST['voyfields'])) {
   $voyagerfields = nl2br($_POST['voyfields']);
}
// Get Owning Libraries
  $libraries = " ";
  if ($_POST['LibraryLimit'] == "Yes") {
    if(!empty($_POST['library'])){
       foreach($_POST['library'] as $library) {
          $libraries .= "$library<br />";
       }
    }
  }
  else {
    $_POST['LibraryOption'] = '';
  }

// Get Locations
  $locations = " ";
  if ($_POST['LocationLimit'] == "Yes") {
    if (!empty($_POST['loc'])) {
       foreach($_POST['loc'] as $location){
          $locations .= "$location<br />";
       }
    }
  }
  else {
    $_POST['LocationOption'] = '';
  }


  // Get Item Types
  $types = "";
  if ($_POST['TypeLimit'] == "Yes") {
    if(!empty($_POST['type'])){
       foreach($_POST['type'] as $type) {
          $types .= "$type<br />";
       }
    }
  }
  else {
    $_POST['TypeOption'] = '';
  }

  // Get Item Status's
  $statuses = "";
  if ($_POST['StatusLimit'] == "Yes") {
    if(!empty($_POST['stat'])){
       foreach($_POST['stat'] as $status) {
          $statuses .= "$status<br />";
       }
    }
  }
  else {
    $_POST['StatusOption'] = '';
  }

  // Sanitize all fields
  if ($bad_happened == 0) {
  $_POST['RequestorName'] = filter_var($_POST['RequestorName'], FILTER_SANITIZE_STRING);
  $_POST['RequestorEmail'] = filter_var($_POST['RequestorEmail'], FILTER_SANITIZE_STRING);
  $_POST['RequestorDept'] = filter_var($_POST['RequestorDept'], FILTER_SANITIZE_STRING);
  $_POST['RequestorPhone'] = filter_var($_POST['RequestorPhone'], FILTER_SANITIZE_STRING);
  $_POST['ReportTitle'] = filter_var($_POST['ReportTitle'], FILTER_SANITIZE_STRING);
  $_POST['NeededBy'] = filter_var($_POST['NeededBy'], FILTER_SANITIZE_STRING);
  $_POST['Frequency'] = filter_var($_POST['Frequency'], FILTER_SANITIZE_STRING);
  $_POST['OutputFormat'] = filter_var($_POST['OutputFormat'], FILTER_SANITIZE_STRING);
  $_POST['Description'] = filter_var($_POST['Description'], FILTER_SANITIZE_STRING);
  $_POST['LibraryLimit'] = filter_var($_POST['LibraryLimit'], FILTER_SANITIZE_STRING);
  $_POST['LibraryOption'] = filter_var($_POST['LibraryOption'], FILTER_SANITIZE_STRING);
  $_POST['LocationLimit'] = filter_var($_POST['LocationLimit'], FILTER_SANITIZE_STRING);
  $_POST['LocationOption'] = filter_var($_POST['LocationOption'], FILTER_SANITIZE_STRING);
  $_POST['TypeLimit'] = filter_var($_POST['TypeLimit'], FILTER_SANITIZE_STRING);
  $_POST['TypeOption'] = filter_var($_POST['TypeOption'], FILTER_SANITIZE_STRING);
  $_POST['StatusLimit'] = filter_var($_POST['StatusLimit'], FILTER_SANITIZE_STRING);
  $_POST['StatusOption'] = filter_var($_POST['StatusOption'], FILTER_SANITIZE_STRING);
  $_POST['SuppressedRecords'] = filter_var($_POST['SuppressedRecords'], FILTER_SANITIZE_STRING);
  $_POST['SortOutput'] = filter_var($_POST['SortOutput'], FILTER_SANITIZE_STRING);
  $_POST['Attachment'] = filter_var($_POST['Attachment'], FILTER_SANITIZE_STRING);
  $_POST['Info'] = filter_var($_POST['Info'], FILTER_SANITIZE_STRING);
  }

  // Prepare output
  if ($bad_happened == 0) {
    $fullemailbody = "<table rules='all' style='padding:5px; background:#d3d3d3; min-width;500px;'>";
    $fullemailbody .= "<tr style='background:#d3d3d3; height:50px;'><td style='display:tabel-cell; width:auto; font:bold 20px arial,sans-serif;' colspan='2'>Voyager Report Request</td></tr>";
    $fullemailbody .= "<tr style='background:#fff;'><font face='Arial'><td style='display:table-cell;'><strong>Name:</strong></td><td style='display:table-cell; width:auto;'>" . $_POST['RequestorName'] . "</td></font></tr>";
    $fullemailbody .= "<tr style='background:#fff;'><font face='Arial'><td style='display:table-cell;'><strong>Email:</strong></td><td style='display:table-cell; width:auto;'>" . $_POST['RequestorEmail'] . "</td></font></tr>";
    $fullemailbody .= "<tr style='background:#fff;'><font face='Arial'><td style='display:table-cell;'><strong>Department:</strong></td><td style='display:table-cell; width:auto;'>" . $_POST['RequestorDept'] . "</td></font></tr>";
    $fullemailbody .= "<tr style='background:#fff;'><font face='Arial'><td style='display:table-cell;'><strong>Phone:</strong></td><td style='display:table-cell; width:auto;'>" . $_POST['RequestorPhone'] . "</td></font></tr>";
    $fullemailbody .= "<tr style='background:#fff;'><font face='Arial'><td style='display:table-cell;'><strong>Report Title:</strong></td><td style='display:table-cell; width:auto;'>" . $_POST['ReportTitle'] . "</td></font></tr>";
    $fullemailbody .= "<tr style='background:#fff;'><font face='Arial'><td style='display:table-cell;'><strong>Needed By:</strong></td><td style='display:table-cell; width:auto;'>" . $_POST['NeededBy'] . "</td></font></tr>";
    $fullemailbody .= "<tr style='background:#fff;'><font face='Arial'><td style='display:table-cell;'><strong>Frequency:</strong></td><td style='display:table-cell; width:auto;'>" . $_POST['Frequency'] . "</td></font></tr>";
    $fullemailbody .= "<tr style='background:#fff;'><font face='Arial'><td style='display:table-cell;'><strong>Format:</strong></td><td style='display:table-cell; width:auto;'>" . $_POST['OutputFormat'] . "</td></font></tr>";
    $fullemailbody .= "<tr style='background:#fff;'><font face='Arial'><td style='display:table-cell;'><strong>Description:</strong></td><td style='display:block; max-width:500px;'>" . $_POST['Description'] . "</td></font></tr>";
    $fullemailbody .= "<tr style='background:#fff;'><font face='Arial'><td style='display:table-cell;'><strong>Output Fields:</strong></td><td style='display:table-cell; width:auto;'>" . $voyagerfields . "</td></font></tr>";
    $fullemailbody .= "<tr style='background:#fff;'><font face='Arial'><td style='display:table-cell;'><strong>Limit by Owning Library:</strong></td><td style='display:table-cell; width:auto;'>" . $_POST['LibraryLimit'] . $_POST['LibraryOption'] . "</td></font></tr>";
    $fullemailbody .= "<tr style='background:#fff;'><font face='Arial'><td style='display:table-cell;'></td><td style='display:table-cell; width:auto;'>" . $libraries . "</td></font></tr>";
    $fullemailbody .= "<tr style='background:#fff;'><font face='Arial'><td style='display:table-cell;'><strong>Limit by Location:</strong></td><td style='display:table-cell; width:auto;'>" . $_POST['LocationLimit'] . $_POST['LocationOption'] . $_POST['LocationType'] . "</td></font></tr>";
    $fullemailbody .= "<tr style='background:#fff;'><font face='Arial'><td style='display:table-cell;'></td><td style='display:table-cell; width:auto;'>" . $locations . "</td></font></tr>";
    $fullemailbody .= "<tr style='background:#fff;'><font face='Arial'><td style='display:table-cell;'><strong>Limit by Item Type:</strong></td><td style='display:table-cell; width:auto;'>" . $_POST['TypeLimit'] . $_POST['TypeOption'] . "</td></font></tr>";
    $fullemailbody .= "<tr style='background:#fff;'><font face='Arial'><td style='display:table-cell;'></td><td style='display:table-cell; width:auto;'>" . $types . "</td></font></tr>";
    $fullemailbody .= "<tr style='background:#fff;'><font face='Arial'><td style='display:table-cell;'><strong>Limit by Item Status:</strong></td><td style='display:table-cell; width:auto;'>" . $_POST['StatusLimit'] . $_POST['StatusOption'] . "</td></font></tr>";
    $fullemailbody .= "<tr style='background:#fff;'><font face='Arial'><td style='display:table-cell;'></td><td style='display:table-cell; width:auto;'>" . $statuses . "</td></font></tr>";
    $fullemailbody .= "<tr style='background:#fff;'><font face='Arial'><td style='display:table-cell;'><strong>Suppressed Records:</strong></td><td style='display:table-cell; width:auto;'>" . $_POST['SuppressedRecords']. "</td></font></tr>";
    $fullemailbody .= "<tr style='background:#fff;'><font face='Arial'><td style='display:table-cell;'><strong>Sort Output:</strong></td><td style='display:table-cell; width:auto;'>" . $_POST['SortOutput']. "</td></font></tr>";
    $fullemailbody .= "<tr style='background:#fff;'><font face='Arial'><td style='display:table-cell;'></td><td style='display:table-cell; width:auto;'>" . $_POST['SortField'] . "</td></font></tr>";
    $fullemailbody .= "<tr style='background:#fff;'><font face='Arial'><td style='display:table-cell;'><strong>Call Numbers:</strong></td><td style='display:table-cell; width:auto;'>" . $_POST['CallNumber'] . "</td></font></tr>";
    $fullemailbody .= "<tr style='background:#fff;'><font face='Arial'><td style='display:table-cell;'><strong>Attachment:</strong></td><td style='display:table-cell; width:auto;'>" . $_POST['Attachment'] . "</td></font></tr>";
    $fullemailbody .= "<tr style='background:#fff;'><font face='Arial'><td style='display:table-cell;'><strong>Additional Info:</strong></td><td style='display:table-cell; width:auto;'>" . $_POST['Info'] . "</td></font></tr>";
    $fullemailbody .= "</table>";
  }


  // Setup email using PHP Mailer
    $mail = new PHPMailer();
    $mail->IsSMTP();
    $mail->Host = "smtp.ua.edu";
    $mail->Headers = "MIME-Version: 1.0\r\n" . "Content-type: text/plain; charset=iso-8859-1";
    $mail->From = $_POST['RequestorEmail'];
    $mail->FromName = $_POST['RequestorName'];
    $mail->AddAddress("mpatrick@ua.edu", "Michael Patrick");
    $mail->AddAddress("ierm@ua.edu", "UA Libraries ILS and E-Resources");
		// FOR DEV ONLY:
    // $mail->AddAddress("cewyatt@ua.edu", "caryl");
    // $mail->AddAddress("jrmichelich@ua.edu", "james");

    $mail->isHTML(true);
    $mail->Subject = "Voyager Report Request - " . $_POST['ReportTitle'];
    $mail->Body = $fullemailbody;
    #$mail->Body = "<strong><d1>Testing</d1></strong>";

  // Handle Errors and Output Message to User
  if ($submit_error_list) {
    print '<h1 style="font-size:30px; color:red">Request Submission Error</h1>
    <p style="font-size:16px;">The following entry errors were detected in your Voyager Report Request:</p>';
    print '<p style="font-size:16px;">Please click the "Back" button in your browser and correct these errors.<br/>';
    print 'Once corrected, click the "Submit Request" button again attempt to send your request.</p>';
    print '<p><div style="color:#990000">' . $submit_error_list . '</div></p>';
  }
  elseif ($good_referer == 0) {
    print "<h2>Bad Referer - Cannot Proceed</h2>";
    print "<p>Your submission came from an invalid location.</p>";
    print "<p>Please follow this link to submit the report from the correct location:<br /><br />";
    print '<a href="/intranet/voyager-request">Voyager Report Request</a></p><br />';
  }
  else {
    // No error condition - attempt to send email
    if(!$mail->Send()) {
      echo "<h2>Mail Send Error</h2>";
      echo "<p>There was an SMTP (mail server) error while sending your request.</p>";
      echo "<p>Please click the back button in your browser and attempt to send the request again.<br /><br />";
      echo "Error: " . $mail->ErrorInfo;
      echo "</p><br />";
      error_log("VOYAGER-REPORT-REQUEST: SMTP Error: " . $mail->ErrorInfo);
    } else {
      // Success message
      print '<h2>Your request has been submitted</h2>';
      print '<p style="font-size:14px;">We will review your report request and contact you for further clarifications as needed.  Thank you for allowing us to serve your Voyager report needs.<br /><br />For your records a copy of this request has been sent to the email address you provided.<br />';
      print '<br /><p align="center"><a href="/intranet/">Return to Intranet Home</a></p>';
    }

  }

?>

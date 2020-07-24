
	<div class="container">
		<div class="row">
			<div class="col-md-12" id="skip-to-content">
<!-- Form to handle the upload - The enctype value here is very important -->
<?php



$current_user = wp_get_current_user();
if ( ! ( $current_user instanceof WP_User ) ) {
     return;
}

$user_name = $current_user->user_nicename;
$user_email = $current_user->user_email;
?>
          <form  class="form-horizontal" action="/intranet/tech-request-result" method="post" id="techRequest" enctype="multipart/form-data">
<div class="form-group">
  <div class="row">
    <div class="col-md-12">
              <label for="requester">Requester</label>
              <input class="form-control" type="text" id="requester" name="requester" value=" <?php echo $user_name; ?> "></input>

              <label for="email">Email</label>
              <input class="form-control" type="text" id="email" name="email" value=" <?php echo $user_email; ?> "></input>
    </div>
  </div>
  <div class="row">
    <div class="col-md-12">
    
              <label for="department">Requesting department</label>
              <input class="form-control" type="text" id="department" name="department"></input>

              <label for="requestType">Request type</label>
              <select class="form-control" id="requestType" name="requestType">
                <option value="software">Software</option>
                <option value="hardware">Hardware</option>
                <option value="combination">Combination</option>
              </select>
    </div>
  </div>
</div><!-- end section -->
<div class="row">
  <div class="col-md-12">

            <label for="itemType">Type of Item (laptop, keyboard, name of software, etc.)</label>
            <input class="form-control" type="text" id="itemType" name="itemType"></input>
  </div>
</div>
<div class="row">
  <div class="col-md-12">

            <label for="description">Description</label>
            <textarea class="form-control" type="text" id="description" name="description"></textarea>
  </div>
</div>
<div class="row">
  <div class="col-md-12">
            <label for="purpose">Purpose</label>
            <textarea class="form-control" type="text" id="purpose" name="purpose"></textarea>

  </div>
</div>
<div class="row">
  <div class="col-md-12">

            <label for="costEstimate">Cost estimate</label>
            <input class="form-control" type="text" id="costEstimate" name="costEstimate"></input>
  </div>
</div>
<div class="row">
  <div class="col-md-12">

            <input class="form-control" type='file' accept='.tiff' id='imageUpload' name='imageUpload'></input>
                  <?php // submit_button('Upload') ?>
            <button type="submit">Send email</button>
            <input type="hidden" name="submitted" id="submitted" value="true" />
  </div>
</div>
          </form>
			</div> <!-- .col-md-9 -->

		</div> <!-- .row -->
	</div> <!-- .container -->


	<div class="container">
		<div class="row">
			<div class="col-md-12" id="skip-to-content">
<!-- Form to handle the upload - The enctype value here is very important -->
<?php



$current_user = wp_get_current_user();
if ( ! ( $current_user instanceof WP_User ) ) {
     return;
}

$user_name = $current_user->display_name;
$user_email = $current_user->user_email;
?>
          <form   action="/intranet/tech-request-form-result" method="post" id="techRequest" enctype="multipart/form-data">
<div class="form-group">
  <div class="row" style="margin-bottom:10px">
    <div class="col-md-6">
              <label for="requester">Requester</label>
              <input class="form-control" type="text" id="requester" name="requester" value=" <?php echo $user_name; ?> "></input>
    </div>
    <div class="col-md-6">
              <label for="email">Email</label>
              <input class="form-control" type="text" id="email" name="email" value=" <?php echo $user_email; ?> "></input>
    </div>
  </div>
  <div class="row" style="margin-bottom:10px">
    <div class="col-md-6">

              <label for="department">Requesting department</label>
              <input class="form-control" type="text" id="department" name="department"></input>
    </div>
    <div class="col-md-6">
              <label for="requestType">Request type</label>
              <select class="form-control" id="requestType" name="requestType">
                <option value="software">Software</option>
                <option value="hardware">Hardware</option>
                <option value="combination">Combination</option>
              </select>
    </div>
  </div>
</div><!-- end section -->
<div class="row" style="margin-bottom:10px">
  <div class="col-md-6">

            <label for="itemType">Type of Item (e.g. laptop, keyboard, name of software)</label>
            <input class="form-control" type="text" id="itemType" name="itemType"></input>
  </div>
  <div class="col-md-6">
            <label for="costEstimate">Cost estimate</label>
            <input class="form-control" type="text" id="costEstimate" name="costEstimate"></input>
  </div>
</div>
<div class="row" style="margin-bottom:10px">
  <div class="col-md-12">

            <label for="description">Description and Quantity</label>
            <textarea class="form-control" type="text" id="description" name="description"></textarea>
  </div>
</div>
<div class="row" style="margin-bottom:10px">
  <div class="col-md-12">
            <label for="purpose">Purpose</label>
            <textarea class="form-control" type="text" id="purpose" name="purpose"></textarea>

  </div>
</div>
<div class="row" style="margin-bottom:10px">
  <div class="col-md-12">

           <label for="imageUpload">Attach cart document (.tiff image only)</label>
            <input class="form-control" type='file' accept='.tiff' id='imageUpload' name='imageUpload'></input>
                  <?php // submit_button('Upload') ?>
            <button style="margin: 30px 0 0 0;font-size: 18px;" type="submit">Submit</button>
            <input type="hidden" name="submitted" id="submitted" value="true" />
  </div>
</div>
          </form>
			</div> <!-- .col-md-9 -->

		</div> <!-- .row -->
	</div> <!-- .container -->

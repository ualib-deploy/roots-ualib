 jQuery(document).ready(function ($) {
     $("#hide-lib").click(function () {
         $("div#library").hide('slow');
     });
     $("#show-lib").click(function () {
         $("div#library").show('slow');
     });
     $("#hide-loc").click(function () {
         $("div#location").hide('slow');
     });
     $("#show-loc").click(function () {
         $("div#location").show('slow');
     });
     $("#hide-type").click(function () {
         $("div#type").hide('slow');
     });
     $("#show-type").click(function () {
         $("div#type").show('slow');
     });
     $("#hide-status").click(function () {
         $("div#status").hide('slow');
     });
     $("#show-status").click(function () {
         $("div#status").show('slow');
     });
   });

var field = 1 ;
function voy_fields() {
 
    field++;
    var objTo = document.getElementById('voy_fields');
    var divtest = document.createElement("div");
	divtest.setAttribute("class", "removefield"+field);
	var fdiv = 'removefield'+field;
    divtest.innerHTML = '<div class="col-sm-12 form-group">' +
								'<div class="input-group">' +
									'<span class="input-group-addon">Field</span> <input class="form-control" id="voyfield" name="voyfield[' + field +']" type="text">' +
									'<div class="input-group-btn">' +
										'<button class="btn btn-danger" type="button"  onclick="remove_voy_fields('+ field +');"> <span class="glyphicon glyphicon-minus" aria-hidden="true"></span> </button>' +
									'</div>' +
								'</div>' +
							'</div>';
    
    objTo.appendChild(divtest);
}
   function remove_voy_fields(fid) {
	   $('.removefield'+fid).remove();
   }

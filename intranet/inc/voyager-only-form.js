jQuery(document).ready(function ($) {
  $("#AssociateDean").change(function (obj) {
    if ($(this).val() == "Tom Wilson") {
      $("#AssociateDeanPhone").val("2299");
      $("#AssociateDeanEmail").val("tcwilson@ua.edu");
    }
    if ($(this).val() == "Millie Jackson") {
      $("#AssociateDeanPhone").val("5008");
      $("#AssociateDeanEmail").val("mljackson@ua.edu");
    }
    if ($(this).val() == "Lorraine Madway") {
      $("#AssociateDeanPhone").val("0513");
      $("#AssociateDeanEmail").val("lmadway@ua.edu");
    }
  });
});

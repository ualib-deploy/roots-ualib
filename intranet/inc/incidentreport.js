function hideshow(which){
  if (!document.getElementById) {
      return;
  }

  if (which.style.display=="block") {
      which.style.display="none";
  } else {
      which.style.display="block";
  }
} 
	
	function showprevy() {
		if (document.getElementById("PrevIncidentY").checked=true)
			document.getElementById("previncidentdescriptiondiv").style.display="block"
		else
			document.getElementById("previncidentdescriptiondiv").style.display="none"
	}
	
	function showprevn() {
		if (document.getElementById("PrevIncidentN").checked=true)
			document.getElementById("previncidentdescriptiondiv").style.display="none"
		else
			document.getElementById("previncidentdescriptiondiv").style.display="block"
	}
	
/*	function hideshowotherdiv(which) {
		if (which=="show")
			document.getElementById("otherexplaindiv").style.display="inline"
		else
			document.getElementById("otherexplaindiv").style.display="none"
	} */

	function enabledisableother(which) {
		if (which=="show")
			document.getElementById("personotherexplain").disabled=false
		else	
			document.getElementById("personotherexplain").disabled=true
			document.getElementById("personotherexplain").value=""
	}

	function fullreset() {
		document.getElementById("instructions").style.display="none"
		/* document.getElementById("descriptiondiv2").style.display="block" */
		document.getElementById("previncidentdescriptiondiv").style.display="none"
		document.getElementById("personotherexplain").disabled=true
		document.getElementById("witnessdiv2").style.display="none"
		document.getElementById("witnessdiv3").style.display="none"
	}

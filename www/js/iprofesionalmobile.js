// JavaScript Document

// funciones menues
$(window).scroll(function() {
    if ($(this).scrollTop()>0){
        //especiales
		document.getElementById("itemsmenuespeciales").style.opacity = "0";
		document.getElementById("elmenuespeciales").style.backgroundColor = "transparent";
		document.getElementById("cerrarmenuespeciales").style.opacity = "0";
		//menu
		document.getElementById("itemsmenu").style.opacity = "0";
		document.getElementById("elmenu").style.backgroundColor = "transparent";
		document.getElementById("cerrarmenu").style.opacity = "0";
		setTimeout(function(){
			//especiales
			document.getElementById("elmenuespeciales").style.display = "none";
			//menu
			document.getElementById("elmenu").style.display = "none";
		}, 200);
     }
});
function desplegarMenu() {
	cerrarMenuEspeciales();
    document.getElementById("elmenu").style.display = "block";	
	setTimeout(function(){
		document.getElementById("cerrarmenu").style.opacity = "1";
		document.getElementById("itemsmenu").style.opacity = "1";
		document.getElementById("elmenu").style.backgroundColor = "#21272e";
	}, 200);
}
function desplegarMenuEspeciales() {
	cerrarMenu();
    document.getElementById("elmenuespeciales").style.display = "block";	
	setTimeout(function(){
		document.getElementById("cerrarmenuespeciales").style.opacity = "1";
		document.getElementById("itemsmenuespeciales").style.opacity = "1";
		document.getElementById("elmenuespeciales").style.backgroundColor = "#FFFFFF";
	}, 200);
}
function cerrarMenu() {
    document.getElementById("itemsmenu").style.opacity = "0";
	document.getElementById("elmenu").style.backgroundColor = "transparent";
	document.getElementById("cerrarmenu").style.opacity = "0";
	setTimeout(function(){
		document.getElementById("elmenu").style.display = "none";
	}, 200);
}
function cerrarMenuEspeciales() {
    document.getElementById("itemsmenuespeciales").style.opacity = "0";
	document.getElementById("elmenuespeciales").style.backgroundColor = "transparent";
	document.getElementById("cerrarmenuespeciales").style.opacity = "0";
	setTimeout(function(){
		document.getElementById("elmenuespeciales").style.display = "none";
	}, 200);
}
function abrirDivisas() {
    document.getElementById("itemsdivisas").style.height = "183px";	
	setTimeout(function(){
		document.getElementById("masdivisas").style.display = "none";
		document.getElementById("cerrardivisas").style.display = "block";
	}, 200);
}
function cerrarDivisas() {
    document.getElementById("itemsdivisas").style.height = "50px";	
	setTimeout(function(){
		document.getElementById("masdivisas").style.display = "block";
		document.getElementById("cerrardivisas").style.display = "none";
	}, 200);
}
function desplegarRecomendadas() {
    document.getElementById("notasrecomendadas").style.display = "block";	
	setTimeout(function(){	
		document.getElementById("notasrecomendadas").style.height = "240px";
		document.getElementById("tira").style.opacity = "1";
		document.getElementById("cerrarrecomendadas").style.opacity = "1";
	}, 200);
}
function cerrarRecomendadas() {
    document.getElementById("notasrecomendadas").style.height = "0px";
	document.getElementById("tira").style.opacity = "0";
	document.getElementById("cerrarrecomendadas").style.opacity = "0";
	setTimeout(function(){			
		document.getElementById("notasrecomendadas").style.display = "none";	
	}, 200);
}


// slider notas
$('document').ready(function(){
	$('#cbp-fwslider, #cbp-fwslider-der').cbpFWSlider();
	setInterval( function(){
		if($('.cbp-fwnext').is(":visible")){
			$('.cbp-fwnext').click();
		}				
		else{
			$('.cbp-fwdots').find('span').click();
		}
	} ,6000 );
});
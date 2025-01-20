
var NumSub;
var eventoControlado = false;
var Lote;
var DatLote;
var Precio;
var DatPrecio;
var USD;
var EUR;
var GBP;
var PrecioUSD;
var PrecioEUR;
var PrecioGBP;
var Incremento = 100;
var PasaFotos_estado;
var buscador = 0;
var bis;


var num;
var img2eli = 0;

// Estado 0 = botones desactivados
// Estado 1 = Modo espera
// Esatdo 2 = Activo

function funEspera(){

    document.getElementById('conf').style.display = 'none';

    document.getElementById('espera').style.visibility = 'visible';

    PasaFotos_estado = 'espera';

    document.onkeyup = mostrarInformacionTecla;

}

function activarPasafotos(){

    var dat_num_subasta = document.getElementById("forNum").value;
    var dat_euro = document.getElementById('forEUR').value;
    var dat_dol = document.getElementById('forUSD').value;
    var dat_gbp = document.getElementById('forGBP').value;

    NumSub = dat_num_subasta;
    USD = 1/dat_dol;
    EUR = 1/dat_euro;
    GBP = 1/dat_gbp;

    PasaFotos_estado = 0;

    // alert("El numero de subasta es:"+dat_num_subasta);
    // alert("El Dolar vale:"+dat_dol);
    // alert("El Eur vale:"+dat_euro);


    document.getElementById('espera').style.display = 'none';


    document.getElementById('pasafotos').style.visibility = 'visible';

    // var node = document.getElementById('conf');
    // node.parentNode.removeChild(node);

    document.onkeypress = mostrarInformacionCaracter;

    DatLote = 0;

    xmlDatos();
    imagen();
    imagen2();
    imagen3();

    let textoPrecio = document.getElementById("pLote");
    textoPrecio.innerHTML  = Lote;


    PrecioUSD = Math.round(Precio * USD);
    PrecioEUR = Math.round(Precio * EUR);
    PrecioGBP = Math.round(Precio * GBP);

}


function buscarLote(){

    var dat_buscar = document.getElementById("forBuscar").value;

    // alert('veo el onload y el dato de DatLote es:'+dat_buscar);

    var BDatLote = 0;
    // var NumCic =0;
    // alert('valor inicial BDatLote:'+BDatLote);

        if (window.XMLHttpRequest) {
           xhttp = new XMLHttpRequest();
        } else {
           xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhttp.open("GET", "subastas/"+NumSub+"/"+NumSub+".xml", false);
        xhttp.send();
        xmlDoc = xhttp.responseXML;

    while (BDatLote < 1000){
        

        BLote = Math.round(xmlDoc.getElementsByTagName("prnttemp")[BDatLote].getAttribute("lot"));
        BPrecio = Math.round(xmlDoc.getElementsByTagName("prnttemp")[BDatLote].getAttribute("reserve"));


        if (BLote == dat_buscar) {
            Lote = BLote;
            Precio = BPrecio;
            DatLote = BDatLote;
            // alert('El lote es:'+Lote+' el precio es:'+Precio+' valor while BDatLote:'+DatLote);

            BDatLote= 1000;

        }

        BDatLote= ++BDatLote;
        
        
    }

    // alert('El numero de ciclos totales fue:'+NumCic);

    document.getElementById('divBuscador').style.visibility = 'hidden';

    buscador = 0;
    PasaFotos_estado = 1;   

    let textoMensaje = document.getElementById("pMensaje");
    textoMensaje.innerHTML  = '';

    let textoPrecio = document.getElementById("pPrecio");
    textoPrecio.innerHTML  = 0;

    divisas(0);

    let textoLote = document.getElementById("pLote");
    textoLote.innerHTML  = Lote;

    eliminarFoto();
    imagen();
    imagen2();
    imagen3();



}



window.onload = function() {

    document.getElementById('espera').style.visibility = 'hidden';

    document.getElementById('pasafotos').style.visibility = 'hidden';

    document.getElementById('divBuscador').style.visibility = 'hidden';

    document.getElementById('forNum').focus();



    //alert("Subasta:"+NumSub+" "+datUSD+" USD "+datEUR+" EUR");




    // document.onkeypress = mostrarInformacionCaracter;
    // document.onkeyup = mostrarInformacionTecla;
    // DatLote = 0;

    // xmlDatos();
    // imagen();
    // imagen2();
    // imagen3();

    // let textoPrecio = document.getElementById("pLote");
    // textoPrecio.innerHTML  = Lote;


    // PrecioUSD = Math.round(Precio * USD);
    // PrecioEUR = Math.round(Precio * EUR);


}

function xmlDatos(){
    if (window.XMLHttpRequest) {
       xhttp = new XMLHttpRequest();
    } else {
       xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhttp.open("GET", "subastas/"+NumSub+"/"+NumSub+".xml", false);
    xhttp.send();
    xmlDoc = xhttp.responseXML;

    lot = xmlDoc.getElementsByTagName("prnttemp")[DatLote].getAttribute("lot");
    subLot = lot.substr(5);
    if (subLot != 'B') {
        Lote = Math.round(lot);
    }else{
        subLot0 = lot.substr(0,1);
        subLot1 = lot.substr(1,1);
        subLot2 = lot.substr(2,1);
        if (subLot0 > 0) {
            Lote = lot;
        }
        else if(subLot1 > 0){
            Lote = lot.substr(1);
        }
        else if(subLot2 > 0){
            Lote = lot.substr(2);
        }
        else{
            Lote = lot.substr(3);
        }
    }

    Precio = Math.round(xmlDoc.getElementsByTagName("prnttemp")[DatLote].getAttribute("reserve"));

}


function precioIncremento(datIncremento){

    let textoPrecio = document.getElementById("pPrecio");
    Precio += datIncremento;
    Incremento = datIncremento;
    textoPrecio.innerHTML  = Intl.NumberFormat("us-US").format(Precio); // Le pongo el contenido

}

function precioDecremento(datDecremento){

    let textoPrecio = document.getElementById("pPrecio");
    Precio -= datDecremento;

    if (Precio < 0) {
        Precio = 0;
    }
    
    Incremento = datDecremento;
    textoPrecio.innerHTML  = Intl.NumberFormat("us-US").format(Precio); // Le pongo el contenido

}

function divisas(datPrecio){

    let textoPrecioUSD = document.getElementById("pPrecioUSD");
    PrecioUSD = Math.round(datPrecio * USD);
    textoPrecioUSD.innerHTML  = Intl.NumberFormat("us-US").format(PrecioUSD)+" USD";

    let textoPrecioEUR = document.getElementById("pPrecioEUR");
    PrecioEUR = Math.round(datPrecio * EUR);
    textoPrecioEUR.innerHTML  = Intl.NumberFormat("us-US").format(PrecioEUR)+" EUR";

    let textoPrecioGBP = document.getElementById("pPrecioGBP");
    PrecioGBP = Math.round(datPrecio * GBP);
    textoPrecioGBP.innerHTML  = Intl.NumberFormat("us-US").format(PrecioGBP)+" GBP";

}

function mostrarInformacionCaracter(evObject) {
    var caracter = String.fromCharCode(evObject.which);
    

    if (caracter == 'b' || caracter == 'B') {
        document.getElementById('forBuscar').value = '';

        if (buscador == 0) {

            document.getElementById('divBuscador').style.visibility = 'visible';
            

            // var textoBuscador = document.getElementById('forBuscar');
            // textoBuscador.value = '';

            // document.getElementById('forBuscar').focus();

            

            buscador = 1;
            PasaFotos_estado = 'buscador';
            
        }else{

            document.getElementById('divBuscador').style.visibility = 'hidden';

            buscador = 0;
            PasaFotos_estado = 1;
            
        }
    }


    if (caracter == 'a' || caracter == 'A') {
        
    }




    if (PasaFotos_estado == 0) {

    }

    else if (PasaFotos_estado == 1) {

    }

    else if (PasaFotos_estado == 2) {

        if (caracter == 'm' || caracter == 'M') {
            msg = 'Puja manual <br>';
        }
        
        else if (caracter == 'o' || caracter == 'O') {

            precioIncremento(50);
            divisas(Precio);
        }

        else if (caracter == '1') {

            precioIncremento(100);
            divisas(Precio);
        }

        else if (caracter == '2') {

            precioIncremento(200);
            divisas(Precio);
        }

        else if (caracter == '3') {

            precioIncremento(300);
            divisas(Precio);
        }

        else if (caracter == '4') {

            precioIncremento(500);
            divisas(Precio);
        }

        else if (caracter == '5') {

            precioIncremento(1000);
            divisas(Precio);
        }

        else if (caracter == '6') {

            precioIncremento(2000);
            divisas(Precio);
        }

        else if (caracter == '7') {

            precioIncremento(5000);
            divisas(Precio);
        }

        else if (caracter == '8') {

            precioIncremento(10000);
            divisas(Precio);
        }

        else if (caracter == '9') {

            precioIncremento(50000);
            divisas(Precio);
        }


        else if (caracter == '0') {

            precioIncremento(100000);
            divisas(Precio);
        }
        

        else{
            // msg = 'Pulsate la letra ' + evObject.which + ' ' + caracter + ' ' +'<br>';
        }

        eventoControlado = true;

    }
}



function mostrarInformacionTecla(evObject) {
    var teclaPulsada = evObject.keyCode;

    if (teclaPulsada == 27) {
    	swal({
		  title: "Seguro deseas salir de la subasta?",
		  text: "",
		  icon: "warning",
		  buttons: true,
		  dangerMode: true,
		})
		.then((willDelete) => {
		  if (willDelete) {
		    window.location = 'index.html';
		  } else {
		    
		  }
		});
    }

    if (teclaPulsada == 13){

        if (PasaFotos_estado == 0) {

            let textoPrecio = document.getElementById("pPrecio");
            textoPrecio.innerHTML  = 0;

            divisas(0);

            animacion = '';
            PasaFotos_estado = 1;

            // activarAnimacion();
        }

        else if (PasaFotos_estado == 1) {
            let textoPrecio = document.getElementById("pPrecio");
            textoPrecio.innerHTML  = Intl.NumberFormat("us-US").format(Precio);

            divisas(Precio);

            PasaFotos_estado = 2;

        }

        else if (PasaFotos_estado == 2) {
            let textoMensaje = document.getElementById("pMensaje");
            textoMensaje.innerHTML  = '';
            PasaFotos_estado = 1;

            let textoPrecio = document.getElementById("pPrecio");
            textoPrecio.innerHTML  = 0;

            divisas(0);

            let textoLote = document.getElementById("pLote");
            DatLote = ++DatLote;
            xmlDatos();
            numLot = Lote;
            textoLote.innerHTML  = numLot;

            eliminarFoto();
            imagen();
            imagen2();
            imagen3();

            // activarAnimacion();

        }

        else if (PasaFotos_estado == 'espera') {
            PasaFotos_estado = 3;
        }

        else if (PasaFotos_estado == 3) {
            activarPasafotos();
        }

    }

    else{

    }




    if (PasaFotos_estado == 0) {


    }

    else if (PasaFotos_estado == 1) {

        if (teclaPulsada == 37) {
            let textoLote = document.getElementById("pLote");
            DatLote = --DatLote;

            xmlDatos();
            textoLote.innerHTML  = Lote;
            eliminarFoto();
            imagen();
            imagen2();
            imagen3();

            // activarAnimacion();
        }

        else if (teclaPulsada == 39) {
            let textoLote = document.getElementById("pLote");
            DatLote = ++DatLote;

            xmlDatos();
            textoLote.innerHTML  = Lote;
            eliminarFoto();
            imagen();
            imagen2();
            imagen3();

            // activarAnimacion();
        }


    }

    else if (PasaFotos_estado == 2) {

        if (teclaPulsada == 38) {

            precioIncremento(Incremento);
            divisas(Precio);
        }

        else if (teclaPulsada == 40) {

            precioDecremento(Incremento);
            divisas(Precio);
        }

    }

        else if (eventoControlado == false) {
                // msg = 'Pulsada tecla especial '+ evObject.keyCode;
        }

        eventoControlado = false;

 }

 function eliminarFoto(){
    var node = document.getElementById("ImgLot1");
    node.parentNode.removeChild(node);

    node2 = document.getElementById("ImgLot2");
    node2.parentNode.removeChild(node2);

    node3 = document.getElementById("ImgLot3");
    node3.parentNode.removeChild(node3);

 }



 function imagen() {

    num = Lote;
    bis = '';

    var imagenDiv = document.getElementById("divLot1");
    imagenDiv.style = "background-image:url('subastas/"+NumSub+"/fotos/"+num+bis+"_1.jpg');";
    document.getElementById('lotImages').appendChild(imagenDiv);

    var imagen = document.createElement("img");
    imagen.src = "subastas/"+NumSub+"/fotos/"+num+bis+"_1.jpg";
    imagen.style = "opacity:0; width:0;";
    imagen.id = "ImgLot1";
    document.getElementById('divLot1').appendChild(imagen);

    document.getElementById("ImgLot1").onerror = function() {img1Alerta()};

}

function img1Alerta(){
    bis = "A";
    var imagenDiv = document.getElementById("divLot1");
    imagenDiv.style = "background-image:url('subastas/"+NumSub+"/fotos/"+num+bis+"_1.jpg');";

    document.getElementById('lotImages').appendChild(imagenDiv);

}

function imagen2() {

    var imagenDiv2 = document.getElementById("divLot2");
    imagenDiv2.style = "background-image:url('subastas/"+NumSub+"/fotos/"+num+bis+"_2.jpg');";
    document.getElementById('lotImages').appendChild(imagenDiv2);



    var imagen2 = document.createElement("img");
    imagen2.src = "subastas/"+NumSub+"/fotos/"+num+bis+"_2.jpg";
    imagen2.style = "opacity:0; width:0;";
    imagen2.id = "ImgLot2";
    document.getElementById('divLot2').appendChild(imagen2);

    document.getElementById("ImgLot2").onerror = function() {img2Alerta()};


}

function img2Alerta(){
    var imagenDiv2 = document.getElementById("divLot2");
    imagenDiv2.style = "background-image:url('subastas/"+NumSub+"/fotos/"+num+bis+"_1.jpg');";

    document.getElementById('lotImages').appendChild(imagenDiv2);

}

function imagen3() {

    var imagenDiv3 = document.getElementById("divLot3");
    imagenDiv3.style = "background-image:url('subastas/"+NumSub+"/fotos/"+num+bis+"_3.jpg');";

    document.getElementById('lotImages').appendChild(imagenDiv3);



    var imagen3 = document.createElement("img");
    imagen3.src = "subastas/"+NumSub+"/fotos/"+num+bis+"_3.jpg";
    imagen3.style = "opacity:0; width:0;";
    imagen3.id = "ImgLot3";

    document.getElementById('divLot3').appendChild(imagen3);

    document.getElementById("ImgLot3").onerror = function() {img3Alerta()};

}

function img3Alerta(){

    var imagenDiv3 = document.getElementById("divLot3");
    imagenDiv3.style = "background-image:url('subastas/"+NumSub+"/fotos/"+num+bis+"_1.jpg');";

    document.getElementById('lotImages').appendChild(imagenDiv3);

}

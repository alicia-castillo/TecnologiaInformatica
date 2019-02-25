//cunado el documento este listo y todos los objetos 
$(document).ready( function(){
    //Una vez que este listo el documento obtendremos la lista de alumnos y la mostraremos.
    getAlumnos();
    getAlumno();
    //Programacion del boton act para obtener datos del input.
    $("#add").on("click", function(event){
        console.log(event);
        var alumno = { }; //Creacion de objeto con la info necesaria.
        alumno.nombre = $("#nombre").val();
        alumno.clave = $("#clave").val();
        //Invocamos a la funcion para llamadas post y mandamos el obeto.
        sendPOSTRequest(alumno);
    });
  });

  function getAlumno(){
    var al = {};
    var param = window.location.search.substring(1).split("=")[1];
    $.get("http://localhost:3000/alumnos/"+param+"/", function(data){
        console.log(data);
        $("#nom").val(data.nombre);
        $("#cve").val(data.clave);
        al.claveOld = $("#cve").val();
    });

    $('#modify').on('click', (event)=>{
        console.log(event + " modificar click");
        console.log("Modificando usuario: " + al.claveOld);
       
        al.nombreNew = $("#nom").val();
        al.claveNew = $("#cve").val();
        console.log(al.claveNew + "MODIFYCLICK");
        sendPUTRequest(al);
});

function sendPUTRequest(body_object){
    $.ajax({
      method: "PUT",
      url: "http://localhost:3000/alumnos",
      data: body_object
    }).done(function(msg){
        /*swal({
        title: 'Alerta con cierre automatico!',
        text: 'Esta alerta se cerrara en 2 segundos.',
        timer: 2000
      }).then(
        function () {},
        // handling the promise rejection
        function (dismiss) {
          if (dismiss === 'timer') {
            console.log('La alerta fue cerrada en 2 segundos')
            //Aqui puedes hacer tu redireccion
            location.href = "index.html";
          }
        }
      )*/
      location.href = "index.html";
      //alert("Alumno "+ body_object.claveNew + " modificado");
    }).fail(function(msg){
      alert("Error al modificar alumno" + body_object.claveNew);
    });
   //window.location.replace("http://localhost:300/");
    };
}

  function getAlumnos(){
    //LLamada GET para obtener los alumnos
    //Se muestra resultado con una lista en HTML
    //Se utiliza un ciclo for y se genera el codigo HTML
    //Usando Jquery se coloca el HTML en la lista.
    $.get("http://localhost:3000/alumnos", function(data){
        var listHTML = "";
        console.log(data);
        data.forEach(alumno => {
            listHTML += "<li class='list-group-item'>" + 
            " <button type='button' class='delete btn btn-danger btn-sm' data-clave='"+ alumno.clave +"'> <i class='fas fa-trash-alt'></i>delete</i> </button>" + 
            "<a href='modificar.html?="+ alumno.clave +"' <button type='button' class='modificar btn btn-warning btn-sm' data-clave='"+ alumno.clave +"'> <i class='far fa-edit'></i>modificar</i> </button></a>"
            +" ♥ Clave : " + alumno.clave + " | Nombre: " + alumno.nombre +  " ♥</li>";
        });
        $("#lista-alumnos").html(listHTML);
        //Programacion para los botones delete
        $(".delete").on("click", (event) =>{
            console.log("Button delete");
            console.log(event.target);
            sendDELETERequest({ "clave" : event.target.dataset["clave"] });
        });
  
        /*$('.modificar').on('click', (event)=>{
            var idUsuario = $(this).attr('clave');
        console.log("Modificando usuario: " + idUsuario);
        console.log("Boton modificar hii", event.target);
        sendPUTRequest({"clave" : event.target.dataset["clave"]});
  });*/
    });
  }

  function sendPOSTRequest(body_object){
    //Llamada post al backend usando jquery.
    
    $.post("http://localhost:3000/alumnos", body_object , 
    function(){
        alert("Alumno guardado.");
        //Actualizamos la lista html para ver los cambios.
        getAlumnos();
        $("#nombre").val("");
        $("#clave").val("");
    });
  }
  function sendDELETERequest(body_object) {
    //Llamada delete al backend por medio de jquery
    $.ajax({
        method: "DELETE",
        url: "http://localhost:3000/alumnos",
        data: body_object
        })
        .done(function( msg ) {
            alert( "Alumno eliminado: " + body_object.clave );
        })
        .fail(function(msg){
            alert("Error al eliminar alumno: " + body_object.clave)
        }); 
        getAlumnos();
  }
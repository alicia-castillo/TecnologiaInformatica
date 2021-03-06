const express =  require("express");
const bodyParser = require("body-parser");
var app = express();
var cors = require('cors');

const archivos = require('fs');
var archivo = "alumnos.json";
app.use(cors());

//DB Handler
var db = {
    //Indicar BD o abrir conexion
    initDB: function () {
        var fs = require("fs");
        var contents = fs.readFileSync(archivo);
        this.alumnos = JSON.parse(contents);
        console.log(this.alumnos);
    },

    //Busqueda Alumno
    getAlumnoBy: function (filter, value) {
        console.log("filtro: " + filter + "valor: " + value);
        var selected = null;
        this.alumnos.forEach(alumno => {
            console.log(alumno);
            console.log(alumno[filter]);
            if (alumno[filter] == value) {
                selected = alumno;
                return selected;
            }
        });
        return selected;
    },

    //Eliminar un alumno por la clave
    deleteAlumnoByClave : function (clave) {
      var index;
      //Buscamos el indice del alumno
      for (index = 0; index < this.alumnos.length; index++) {
        if(this.alumnos[index].clave == clave )
        break;
      }
      
      //Si se encontro el indice se elimina
      if(index<db.alumnos.length){
        delete db.alumnos[index];
        db.alumnos.splice(index, 1);
        db.saveAlumnos();
      }
    },

    saveAlumnos : function(){
      archivos.writeFileSync('alumnos.json', JSON.stringify(this.alumnos),
        function (error) {
            if (error) {
                console.log('Hubo un error al escribir en el archivo')
                console.log(error);
            }
        });
    },

    modifyAlumno : function(claveOld, claveNew, nombreNew){
      var index;
      for(index=0; index < this.alumnos.length; index++){
        if(this.alumnos[index].clave == claveOld )
        break;
      }
      if(index<this.alumnos.length){
        this.alumnos[index].clave = claveNew;
        this.alumnos[index].nombre = nombreNew;
        db.saveAlumnos();
      }

    }
    
}
db.initDB();
app.use(express.static('assets'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',function(req,res){
  res.sendfile("index.html" );
});

app.route("/alumnos")
  .get( (req, res) => {
    db.initDB();
    res.json(db.alumnos);
  })
  .post((req,res)=> {
    db.initDB();
    var alumno = req.body;
    console.log("Objeto post recibido");
    console.log(alumno);
    db.alumnos.push(alumno);
    db.saveAlumnos();
    res.json({'status' : 'OK'});
  })
  .delete((req,res)=> {
    db.initDB();
    var alumno = req.body;
    console.log("Objeto post recibido");
    console.log(alumno);
    db.deleteAlumnoByClave( alumno.clave );
    console.log(db.alumnos);
    res.json({'status' : 'OK'})
  })
  .put((req,res)=>{
    db.initDB();
    console.log("IM IN PUTTTT"+req);
    var alumno = req.body;
    //db.deleteAlumnoByClave(alumno.clave);
    //db.alumnos.push(alumno);
    db.modifyAlumno(alumno.claveOld, alumno.claveNew, alumno.nombreNew);
    console.log(alumno);
    res.json({'status': 'ok'});
  });

app.get('/alumnos/:clave', (req, res) => {
  db.initDB();
  var clave = req.params.clave;
  var alumno = db.getAlumnoBy('clave', clave);
  res.json(alumno);
});

app.listen(3000,function(){
  console.log("Started on PORT 3000");
})


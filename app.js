const express =  require("express");
const bodyParser = require("body-parser");
var app = express();
var arch = "./ingredientes.json"
const archivos = require('fs');
var ingredientes = [];


//DB Handler
var db = {
    //Indicar BD o abrir conexion
    initDB: function () {
        var fs = require("fs");
        var contents = fs.readFileSync(arch);
        this.ingredientes = JSON.parse(contents);
    },

    //Busqueda Alumno
    getIngredienteBy: function (filter, value) {
        console.log("filtro: " + filter + "valor: " + value);
        var selected = null;
        this.ingredientes.forEach(ingrediente => {
            console.log(ingrediente);
            console.log(ingrediente[filter]);
            if (ingrediente[filter] == value) {
                selected = ingrediente;
                return selected;
            }
        });
        return selected;
    },

    saveIngrediente : function(){
      archivos.writeFileSync(arch, JSON.stringify(this.ingredientes),
        function (error) {
            if (error) {
                console.log('Hubo un error al escribir en el archivo')
                console.log(error);
            }
        });
    }
    
}

app.use(express.static('assets'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
db.initDB();

app.get('/',function(req,res){
  res.sendfile("index.html" );
});

app.get('/ingredientes', (req, res) => {
  //db.initDB();
  res.json(db.alumnos);
});

app.get('/ingredientes/:nombre', (req, res) => {
  //db.initDB();
  var nombre = req.params.nombre;
  var ingrediente = db.getIngredienteBy('nombre', nombre);
  res.json(ingrediente);
});

app.post('/ingredientes',function(req,res){
  //db.initDB();
  var ingrediente = req.body;
  console.log("Objeto post recibido");
  console.log(ingrediente);
  db.ingredientes.push(ingrediente);
  db.saveIngrediente();
  res.json({'status' : 'OK'});
});

//app.route("/alumnos").get()//para separar rutas multiples con dif. funciones


app.listen(3000,function(){
  console.log("Started on PORT 3000");
})

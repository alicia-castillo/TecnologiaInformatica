const express = require('express');
const app = new express();
const port = 3000;
var archivos = require('fs');
var alumnos = [];

var db = {
    initDB : function(){
        //this.alumnos = require('/alumnos.json');
        archivos.readFile('alumnos.json', function(error,datos)
        {
            if(error){
                console.log('Error al leer el archivo');
            }else{
                alumnos = JSON.parse(datos);
                console.log(alumnos);
            }
        });
    },   
    getAlumnoBy : function (filter,value) {
        console.log("filtro: " + filter + "valor: " + value);
        var selected = null;
        this.alumnos.array.forEach(alumno => {
            console.log(alumno);
            console.log(alumno[filter]);
            if(alumno[filter] == value){
                selected = alumno;
                return selected;
            }
        });
        return selected;
    },
    getAlumnoBy2 : function(req) {
        var encontrado = false;
        console.log(alumnos);
       //console.log(req.params.id + "the second ");
    for (i = 0; i < alumnos.length; i++) {
        //console.log(alumnos[i].id + "alumno");
        if (alumnos[i].id === req.params.id) {
            console.log("found it");
            encontrado = true;
            console.log(alumnos[i]);
           return i;
        }
    }
    if (!encontrado) {
        console.log("did not find it :c");
        return null;
    }
    },
    addAlumno : function (){
        archivos.writeFile('alumnos.json', JSON.stringify(alumnos), function (error) {  
            if(error){
                console.log('Error al esribir el archivo');
                console.log(error);
            }
        });
    }
}
db.initDB();
app.post('/alumnos', function(req, res){
    db.initDB();
});

app.post('/alumnos/:id', function(req,res){
    //console.log(req.params.id);
    //db.getAlumnoBy("id",req.params.id);
    db.getAlumnoBy2(req);
});

app.post('/agrega', function (req, res) {
    //agregar un nuevo usuario
    //res.send('Recibí un post para agregar ' + req.body.nombre + "," + req.body.password);
    //console.log('Cuerpo del Post:' + req.body.nombre);
    console.log('Agregando usuario...');
    console.log(req.body);
    //req.body.id = Date.now();
    alumnos.push(req.body);
    res.json({ agregado: 'ok' });
    db.addAlumno();
});

app.listen(port, function () {
    console.log('Servidor corriendo en el puerto: ' + port);
});
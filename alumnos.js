const express = require('express');
const app = new express();
const port = 3000;
var archivos = require('fs');
var alumnos = [];

var db = {
    initDB : function(){
        //this.alumnos = require('/alumnos.json');
        archivos.readFile('alumnos.json');
        alumnos = JSON.parse(datos);
    },   
    getAlumnoBy : function (filter,value) {
        console.log("filtro: " + filter + "valor" + value);
        var selected = null;
        this.alumnos.array.forEach(alumno => {
            console.log(alumno);
            console.log(alumno[filter]);
            if(alumno[filtere] == value){
                selected = alumno;
                return selected;
            }
        });
        return selected;
    }
}
'use strict'

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors")

const usuario_ruta = require("./src/rutas/usuario.rutas");
const empleado_ruta = require("./src/rutas/empleado.ruta");


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(cors());

app.use('/api' , usuario_ruta, empleado_ruta  );

module.exports = app;
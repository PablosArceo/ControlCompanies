'use strict'

const express = require('express');
const usuarioControlador = require('../controladores/usuario.controlador');
const md_autentication = require('../middlewares/authenticated');


const api = express.Router();

api.post('/loginUsuario', usuarioControlador.loginUsuario );
api.post('/agregarEmpresa/:idUsuario', md_autentication.ensureAuth,usuarioControlador.agregarEmpresa );
api.put('/editarEmpresa/:idUsuario/:idEmpresa', md_autentication.ensureAuth,usuarioControlador.editarEmpresa);
api.delete('/eliminarEmpresa/:idUsuario/:idEmpresa', md_autentication.ensureAuth,usuarioControlador.eliminarEmpresa);



module.exports = api;
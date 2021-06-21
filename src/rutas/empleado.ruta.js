'use strict'

const express = require('express');
const empleadoControlador = require('../controladores/empleado.controlador');
const usuarioControlador = require('../controladores/usuario.controlador');
const md_autentication = require('../middlewares/authenticated');


const api = express.Router();


api.post('/agregarEmpleados', md_autentication.ensureAuth, empleadoControlador.agregarEmpleados );
api.put('/editarEmpleados/:idEmpleado', md_autentication.ensureAuth, empleadoControlador.editarEmpleados );
api.delete('/eliminarEmpleados/:idEmpleado', md_autentication.ensureAuth, empleadoControlador.eliminarEmpleados );
api.get('/obtenerEmpleadosId/:idEmpleado', md_autentication.ensureAuth, empleadoControlador.obtenerEmpleadosId );
api.get('/obtenerEmpleadosNombre/:nombreEmpleado', md_autentication.ensureAuth, empleadoControlador.obtenerEmpleadosNombre );
api.get('/obtenerEmpleadoPuesto/:puesto', md_autentication.ensureAuth, empleadoControlador.obtenerEmpleadoPuesto );
api.get('/obtenerEmpleadoDepartamento/:departamento', md_autentication.ensureAuth, empleadoControlador.obtenerEmpleadoDepartamento );
api.get('/obtenerListaEmpleados', md_autentication.ensureAuth, empleadoControlador.obtenerListaEmpleados );
api.get('/imprimirPDF',md_autentication.ensureAuth,empleadoControlador.imprimirPDF);
module.exports = api;
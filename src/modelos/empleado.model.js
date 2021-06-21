'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var empleadoShema = Schema({
nombreEmpleado: String,
puesto: String,
departamento: String,

empresa: {type: Schema.Types.ObjectId, ref: 'Usuarios' }


});
module.exports= mongoose.model('empleados',empleadoShema);
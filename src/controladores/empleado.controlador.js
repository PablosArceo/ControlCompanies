'use strict'

var Empleado = require('../modelos/empleado.model');
var Empresa = require('../modelos/usuario.model');
var bcrypt  = require('bcrypt-nodejs');
const pdf = require('html-pdf');


function agregarEmpleados(req,res){
    var empleado = new Empleado();
    var params = req.body;
    if(req.user.rol === 'ROL_EMPRESA'){
                
      if(params.nombreEmpleado && params.puesto && params.departamento){

        empleado.nombreEmpleado= params.nombreEmpleado;
        empleado.puesto = params.puesto;
        empleado.departamento = params.departamento;
       
        empleado.empresa = req.user.sub 
        Empleado.find({
         $or:[{nombreEmpleado:empleado.nombreEmpleado}]
            
            
            }).exec((err, usuarioEncontrado)=>{
                 if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
                 
                 if(usuarioEncontrado && usuarioEncontrado.length==1  ){
                   return res.status(500).send({mensaje:'Empleado ya existe'})
                  
                 }else{
                    bcrypt.hash(params.password, null, null, (err, passwordCorrecta)=>{
                        if(err){
                            res.status(500).send({message:'Error al encriptar contraseña.'});
                        }else if(passwordCorrecta){
                            Empleado.password = passwordCorrecta;
                        }else{
                            res.status(418).send({message:'Error inesperado.'});
                        }
                      
                         empleado.save((err,EmpleadoGuardado)=>{
                            if(err) return res.status(500).send({mensaje:'Error al agregar Empleado'})
                            if(EmpleadoGuardado){
                                 return res.status(200).send({ EmpleadoGuardado });
           
                            }else{
                             return res.status(500).send({mensaje:'No se ha podido agregar el Empleado'})

                            }  
                         })
                       
                     })
                 }

            })


}


}else{
    return res.status(500).send({mensaje:'Solo Empresas Puede Agregar Empleados'})
    
}


}

function editarEmpleados(req, res) {
var idEmpleado = req.params.idEmpleado;
var params = req.body;

Empleado.findById(idEmpleado, (err,EmpleadoEncontrado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la busqueda de empleado'})
        if(EmpleadoEncontrado){
              if (EmpleadoEncontrado.empresa == req.user.sub){
                  Empleado.updateOne(EmpleadoEncontrado,params, {new: true}, (err,EmpleadoActualizado)=>{
                  if(err) return res.status(500).send({mensaje:'Error general'})
                  if(!EmpleadoActualizado) return res.status(500).send({mensaje: 'Empleado no actualizado, revise los datos'})
                  return res.status(200).send({mensaje: 'Empleado Actualizado'})
                  })
              }else{
                  return res.status(500).send({mensaje:'Solo la Empresa puede modificar a sus empleados'})
              }   
        }
})
}

function eliminarEmpleados (req, res)  {
    var idEmpleado = req.params.idEmpleado;
      Empleado.findById(idEmpleado, (_err, EmpleadoEliminado) => {
        if (EmpleadoEliminado) {
            if (EmpleadoEliminado.empresa == req.user.sub) {
                Empleado.deleteOne(EmpleadoEliminado, (err) => {
                    if (err) return res.status(501).send({ mensaje: "Empleado no Eliminado" });
                    return res.status(200).send({
                        EmpleadoEliminado,
                        mensaje: "Empleado Eliminado",

                    })
            })
                
            } else {
                return res.status(500).send({ mensaje: 'Solo las empresas pueden eliminar sus empleados' })
            }
        } else {


            return res.status(500).send({ mensaje: 'Empleado Ya Eliminado' })

        }
    })
}


function obtenerEmpleadosId(req, res){
    var idEmpleado = req.params.idEmpleado;
    if (req.user.rol != "ROL_EMPRESA") return res.status(500).send({ mensaje: "Solo Empresa Pueden Obtener Id de los Empleado" })
  
    
    Empleado.findById(idEmpleado, (err, EmpleadoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if (!EmpleadoEncontrado) return res.status(500).send({ mensaje: "ID de Empleado no Encontrado" });
        if (req.user.sub != EmpleadoEncontrado.empresa) return res.status(500).send({ mensaje: "Error en la peticion de Empleado" });
        return res.status(200).send({ EmpleadoEncontrado });
    })
}

function obtenerEmpleadosNombre(req, res){
    var nombreEmpleado = req.params.nombreEmpleado;
    if (req.user.rol != "ROL_EMPRESA") return res.status(500).send({ mensaje: "Solo Empresas Pueden Obtener Nombre del Empleado" })

    Empleado.find({ nombreEmpleado: nombreEmpleado, empresa: req.user.sub }, (err, NombreEmpleadoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if (!NombreEmpleadoEncontrado) return res.status(500).send({ mensaje: "Error en la peticion de Empleado" });
        return res.status(200).send({ NombreEmpleadoEncontrado });
    })
}

function obtenerEmpleadoPuesto(req,res){
    var puesto = req.params.puesto;
    if (req.user.rol != "ROL_EMPRESA") return res.status(500).send({ mensaje: "Solo Empresas Pueden Obtener el puesto del Empleado" })

    Empleado.find({ puesto: puesto, empresa: req.user.sub }, (err, PuestoEmpleadoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Puesto de Empleado no encontrado" });
        if (!PuestoEmpleadoEncontrado) return res.status(500).send({ mensaje: "Error en la peticion de Empleado" });
        return res.status(200).send({ PuestoEmpleadoEncontrado });
    })
}



function obtenerEmpleadoDepartamento(req,res){
    var departamento = req.params.departamento;
    if (req.user.rol != "ROL_EMPRESA") return res.status(500).send({ mensaje: "Solo Empresas Pueden Obtener el departamento del Empleado" })

    Empleado.find({ departamento: departamento, empresa: req.user.sub }, (err, DepartamentoEmpleadoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Departamento de Empleado no encontrado" });
        if (!DepartamentoEmpleadoEncontrado) return res.status(500).send({ mensaje: "Error en la peticion de Empleado" });
        return res.status(200).send({ DepartamentoEmpleadoEncontrado });
    })
}



 function obtenerListaEmpleados (req, res) {
    

    
    if (req.user.rol != "ROL_EMPRESA") return res.status(500).send({ mensaje: "Solo Empresas Pueden Obtener su 8 Lista del Empleados" })

    Empleado.find({ empresa: req.user.sub }, (err, ListaEmpleadosEncontrados) => {
        if (err) return res.status(500).send({ mensaje: "Lista de Empleado no encontrado" });
        if (!ListaEmpleadosEncontrados) return res.status(500).send({ mensaje: "Error en la peticion de Empleado" });
        return res.status(200).send({ ListaEmpleadosEncontrados });
    })

 }
 

function imprimirPDF(req,res){
if (req.user.rol != "ROL_EMPRESA") return res.status(500).send({ mensaje: "Solo Empresas Pueden Obtener su  Lista del Empleados" })

    Empleado.find({ empresa: req.user.sub }, (err, ListaEmpleadosEncontrados) => {
        if (err) return res.status(500).send({ mensaje: "Lista de Empleado no encontrado" });
        if (!ListaEmpleadosEncontrados) return res.status(500).send({ mensaje: "Error en la peticion de Empleado" });
        var ObjectoGuardado = [] 
        ListaEmpleadosEncontrados.forEach(elemento => {ObjectoGuardado.push(elemento)})

       

        const contenido = `
        
        <div class="text-center">
        <h1 ></h1>
          
        <div class="container col-lg-3">
      
        <h1> Empleados  ${req.user.usuario}</h1>
        <table width="100%" border="1" bordercolor="#089DB1" cellspacing="10" cellpadding="10">
        <caption>Empleados Por Empresa   </caption>
        <thead>
          <tr>
            <th>Nombre Empleado</th>
            <th>Puesto</th>
            <th>Departamento</th>
          </tr>
        </thead>
        <tbody>
                        ${ObjectoGuardado.map(lista => `<tr>
                        <td> ${lista.nombreEmpleado} </td>
                        <td> ${lista.puesto} </td>
                        <td> ${lista.departamento} </td>
                        </tr>`).join('').replace(/['"{}']+/g,'')}
                </tbody>
        <tfoot>
         
        </tfoot>
      </table>


        
        `;
        
        pdf.create(contenido).toFile('./src/PDF_EMPLEADOS/PDFLISTAEMPLEADOS.PDF', function(err, res) {
            if (err){
                console.log(err);
            } else {
                console.log(res);
            }
        })
        return res.status(200).send( ListaEmpleadosEncontrados );

    })
   
 }



module.exports={
agregarEmpleados,
editarEmpleados,
eliminarEmpleados,
obtenerEmpleadosId,
obtenerEmpleadosNombre,
obtenerEmpleadoPuesto,
obtenerEmpleadoDepartamento,
obtenerListaEmpleados,
imprimirPDF
}
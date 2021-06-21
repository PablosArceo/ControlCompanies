'use strict'

var Empresa = require('../modelos/empleado.model');
var bcrypt  = require('bcrypt-nodejs');
var jwt = require('../servicios/jwt');
var Usuario = require('../modelos/usuario.model');


// LOGIN DE USUARIO

function loginUsuario(req, res){
    var params = req.body;
    
    Usuario.findOne({ user: params.user }, (err,  usuarioEncontrado)=>{
    if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
    
    if (usuarioEncontrado){                         
           bcrypt.compare(params.password, usuarioEncontrado.password, (err, passCorrecta)=> {
               if(passCorrecta){
                   if(params.obtenerToken === 'true'){
                       return res.status(200).send({
                       token: jwt.createToken(usuarioEncontrado)
                   });
    
               }else{
                   usuarioEncontrado.password = undefined;
                   return res.status(200).send({ usuarioEncontrado })
               }
           }else{
               return res.status(404).send({ mensaje: 'El Usuario no se ha podedido identificar'})
           }
    })
    }else{
        return res.status(404).send({mensaje: 'EL Usuario no se ha podido ingresar'})
    }
    })
    }
    


function agregarEmpresa(req, res){
    var Empresa = new Usuario ();
    var idUsuario =req.params.idUsuario;
    var params = req.body;
    
    if(params.user && params.password){
           
        if(idUsuario!=req.user.sub){
            return res.status(500).send({mensaje: "Solo administrador puede agregar empresas"});
        }
               

        Usuario.find({$or:[
            {user:params.user},
        ]}, (err, empresaEncontrada)=>{
            if(err){
                res.status(500).send({message:'Error general, intentelo mas tarde.'});
            }else if(empresaEncontrada && empresaEncontrada.length==1 ){
                res.send({message:'Empresa Ya existente'});
            }else{
              
                Empresa.user = params.user;
                Empresa.rol='ROL_EMPRESA'

                bcrypt.hash(params.password, null, null, (err, passwordCorrecta)=>{
                    if(err){
                        res.status(500).send({message:'Error al encriptar contraseña.'});
                    }else if(passwordCorrecta){
                        Empresa.password = passwordCorrecta;
                    }else{
                        res.status(418).send({message:'Error inesperado.'});
                    }
                });

                Empresa.save((err, EmpresaGuardada)=>{
                    if(err){
                        res.status(500).send({message:'Erro general al guardar empresa.'});
                    }else if(EmpresaGuardada){
                        return res.status(200).send({ EmpresaGuardada });
                    }else{
                        res.status(404).send({message:'Empresa no guardada.'});
                    }
                });
            }
        });
    }else{
        res.send({message:'Ingresa todos los datos.'});
    }

}


function editarEmpresa(req, res){
    var idEmpresa = req.params.idEmpresa;
    var idUsuario = req.params.idUsuario;
    var params = req.body;
    
   if(idUsuario!=req.user.sub){
            return res.status(500).send({mensaje: "Solo administrador puede agregar empresas"});
        }
            
    // Propiedad Administrador no puede eliminar Contraseña
    delete params.password;


  
    Usuario.findByIdAndUpdate(idEmpresa, params, { new: true }, (err, EmpresaActualizada)=>{ 
        if(err) return status(500).send({mensaje: 'Error en la peticion'});
        if(!EmpresaActualizada) return res.status(500).send({ mensaje: 'No se ha podido actualizar la empresa'})
  
        return res.status(200).send({ EmpresaActualizada });

    } )
}


function eliminarEmpresa(req, res){
    var idEmpresa = req.params.idEmpresa;
    var idUsuario = req.params.idUsuario;
    var params = req.body;


    // Propiedad Administrador no puede eliminar Contraseña
    delete params.password;

    Usuario.findByIdAndDelete(idEmpresa, (err, EmpresaEliminada)=>{ 
        if(err) return status(500).send({mensaje: 'Error en la peticion'});
        if(!EmpresaEliminada) return res.status(500).send({ mensaje: 'No se ha podido eliminar la empresa'})
  
        return res.status(200).send({ EmpresaEliminada });

    } )
}
   




function obtenerEmpresas(req, res){
    var idEmpresa = req.params.idEmpresa;
    var idUsuario = req.params.idUsuario;
    var params = req.body;



    if(idUsuario!=req.user.sub){
        return res.status(500).send({mensaje: "Solo administrador puede agregar empresas"});
    }



    Usuario.find().populate('user').exec((err, EmpresasEncontradas)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de Empresas'});
        if(!EmpresasEncontradas) return res.status(500).send({mensaje: 'Error al obtener Empresas'});
        return res.status(200).send({EmpresasEncontrados});
    })
}
 


module.exports={
agregarEmpresa,
editarEmpresa,
eliminarEmpresa,
obtenerEmpresas,
loginUsuario,


 }
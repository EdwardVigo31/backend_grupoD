const User = require('../models/user');
const bcrypt =  require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const storage = require('../utils/cloud_storage');
const Rol = require('../models/rol');
const { use } = require('passport');


module.exports={
    findDeliveryMen(req, res) {
        User.findDeliveryMen((err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con al listar los repartidores',
                    error: err
                });
            }

            
            return res.status(201).json(data);
        });
    },


    login(req,res){
        const email = req.body.email;
        const password = req.body.password;
        User.findByEmail(email, async(err, dataUser) =>{
            console.log('ERROR', err);
            console.log('USURIO', dataUser);

            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }
            if(!dataUser){
                return res.status(401).json({
                    success: false,
                    message: 'El email no fue encontrado',

                });    
            }
            const isPasswordValid = await bcrypt.compare(password,dataUser.password);
            if(isPasswordValid){
                const token = jwt.sign({id: dataUser.id, email: dataUser.email}, keys.secretOrKey,{});
                const data= {
                    id: `${dataUser.id}`,
                    name:dataUser.name,
                    lastname:dataUser.lastname,
                    email:dataUser.email,
                    phone:dataUser.phone,
                    image: dataUser.image,
                    session_token: `JWT ${token}`,
                    roles: dataUser.roles

                }
                return res.status(201).json({
                    success: true,
                    message: 'El Usuario fue autenticado',
                    data: data
    
                });

            }
            else{
                return res.status(401).json({
                    success: false,
                    message: 'El password es incorrecto',

                });  
            }

           
        });
    },

    register(req, res){
        const user = req.body;
        User.create(user,(err, data) =>{

            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente',
                data: data

            });
        });
    },
    
    async registerWithImage(req, res){
        const user = JSON.parse(req.body.user); 
        const files =req.files;

        if(files.length>0){
            const path =`image_${Date.now()}`;     
            const url= await storage(files[0], path);

            if(url!=undefined && url != null){
                user.image = url;
            }
           }
        User.create(user,(err, data) =>{


            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }



         
            user.id = `${data}`;
            const token = jwt.sign({id: user.id, email: user.email}, keys.secretOrKey,{});
            user.session_token = `JWT ${token}`;
            
            Rol.create(user.id, 3,(err,data) =>{
                if(err){
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con el registro del rol de usuario',
                        error: err
                    });
                }
                return res.status(201).json({
                    success: true,
                    message: 'El registro se realizo correctamente',
                    data: user
    
                });

            });


            
        });
    },
    async updateWithImage(req, res){
        const user = JSON.parse(req.body.user); 
        const files =req.files;
    
        if(files.length>0){
            const path =`image_${Date.now()}`;     
            const url= await storage(files[0], path);
    
            if(url!=undefined && url != null){
                user.image = url;
            }
        }
        User.update(user,(err, data) =>{
            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }
            User.findById(data,(err, data)=>{
                if(err){
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con el registro del usuario',
                        error: err
                    });
                }
                // Elimina la contraseña del objeto de datos antes de devolverlo
                delete data.password;
                data.session_token = user.session_token;
                return res.status(201).json({
                    success: true,
                    message: 'El usuario se actualizo correctamente',
                    data: data
                });
            })
        });
    },
    
    async updateWithoutImage(req, res){
        const user = req.body;
        User.updateWithoutImage(user,(err, data) =>{
            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }
            User.findById(data,(err, data)=>{
                if(err){
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con el registro del usuario',
                        error: err
                    });
                }
                // Elimina la contraseña del objeto de datos antes de devolverlo
                delete data.password;
                data.session_token = user.session_token;
                return res.status(201).json({
                    success: true,
                    message: 'El usuario se actualizo correctamente',
                    data: data
                });
            })
        });
    },
    async updateNotificationToken(req, res) {

        const id = req.body.id; 
        const token = req.body.token; 

        User.updateNotificationToken(id, token, (err, id_user) => {

        
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error actualizando el token de notificaciones del usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El token se actualizo correctamente',
                data: id_user
            });
            
        });

    },

}    

    


 
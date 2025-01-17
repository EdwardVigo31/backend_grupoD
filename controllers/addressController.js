const Address = require('../models/address');
module.exports={

    findByUser(req,res){
        const id_user = req.params.id_user;
        Address.findByUser(id_user,(err,data)=>{
            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al trata de obtener las direcciones',
                    error: err
                });
            }
            return res.status(201).json(data);


        })
    },
    create(req,res){
        const address = req.body;
        console.log('ADDRESS: ', address);
        Address.create(address,(err,id)=>{
            
            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error el registro d ela direccion',
                    error: err
                });
            }
            return res.status(201).json({
                success: true,
                message: 'La direccion se creo correctamente',
                data: `${id}`

            });

        })
    },
}
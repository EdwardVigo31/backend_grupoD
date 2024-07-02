const Order = require('../models/order');
const OrderHasProducts = require('../models/order_has_products');
const User = require('../models/user');
const PushNotificationsController = require('../controllers/pushNotificationsController');

module.exports={
    findByStatus(req, res) {
        const status = req.params.status;
    
        Order.findByStatus(status, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar las ordenes',
                    error: err
                });
            }
    
    
            return res.status(201).json(data);
        });
    },
    
   
    findByDeliveryAndStatus(req, res) {
        const id_delivery = req.params.id_delivery;
        const status = req.params.status;

        Order.findByDeliveryAndStatus(id_delivery, status, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar las ordenes',
                    error: err
                });
            }

            
            
            return res.status(201).json(data);
        });
    },
    
    findByClientAndStatus(req, res) {
        const id_client = req.params.id_client;
        const status = req.params.status;

        Order.findByClientAndStatus(id_client, status, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar las ordenes',
                    error: err
                });
            }

           
            
            return res.status(201).json(data);
        });
    },
    async create(req,res){
        const order = req.body;
        Order.create(order, async (err,id)=>{
            
            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al crear la orden',
                    error: err
                });
            }

            for(const product of order.products){
                await OrderHasProducts.create(id,product.id,product.quantity,(err,id_data)=>{
                    if(err){
                        return res.status(501).json({
                            success: false,
                            message: 'Hubo con la creacion de los productos en la orden',
                            error: err
                        });
                    }
                    
                });
            }
            return res.status(201).json({
                success: true,
                message: 'La orden se creo correctamente',
                data: `${id}`

            });
           

        });
    },
    updateToDispatched(req, res) {
        const order = req.body;

        Order.updateToDispatched(order.id, order.id_delivery, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de actualizar la orden',
                    error: err
                });
            }
            User.findById(order.id_delivery, (err, user) => {
                
                if (user !== undefined && user !== null) {

                    console.log('NOTIFICATION TOKEN', user.notification_token);
                    PushNotificationsController.sendNotification(user.notification_token, {
                        title: 'PEDIDO ASIGNADO',
                        body: 'Te han asignado un pedido para entregar',
                        id_notification: '1'
                    });
                }

            });

         
            
            return res.status(201).json({
                success: true,
                message: 'La orden se ha actualizado correctamente',
                data: `${id_order}` // EL ID 
            });

        });
    },
    
    updateToOnTheWay(req, res) {
        const order = req.body;


        Order.updateToOnTheWay(order.id, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de actualizar la orden',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se ha actualizado correctamente',
                data: `${id_order}` // EL ID 
            });

        });
    },
    updateToDelivered(req, res) {
        const order = req.body;

        Order.updateToDelivered(order.id, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de actualizar la orden',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se ha actualizado correctamente',
                data: `${id_order}` // EL ID 
            });

        });
    },
    
    
    updateLatLng(req, res) {
        const order = req.body;

        Order.updateLatLng(order, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de actualizar la orden',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se ha actualizado correctamente',
                data: `${id_order}` // EL ID 
            });

        });
    }

    
}

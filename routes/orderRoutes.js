
const ordersController = require('../controllers/ordersController');
const passport = require('passport');


module.exports=(app) =>{

    // GET -> obtener datos
    //POST -> Almacenar datos
    //PUT -> ACTUALIZAR datos
    //DELETE -> Eliminar datos
    app.get('/api/orders/findByStatus/:status',  passport.authenticate('jwt', { session: false }), ordersController.findByStatus);
    app.get('/api/orders/findByDeliveryAndStatus/:id_delivery/:status',  passport.authenticate('jwt', { session: false }), ordersController.findByDeliveryAndStatus);
    app.get('/api/orders/findByClientAndStatus/:id_client/:status',  passport.authenticate('jwt', { session: false }), ordersController.findByClientAndStatus);
    app.post('/api/orders/create',passport.authenticate('jwt',{session:false}),  ordersController.create);
    app.put('/api/orders/updateToDispatched',  passport.authenticate('jwt', { session: false }), ordersController.updateToDispatched);
    app.put('/api/orders/updateToOnTheWay',  passport.authenticate('jwt', { session: false }), ordersController.updateToOnTheWay);
    app.put('/api/orders/updateLatLng',  passport.authenticate('jwt', { session: false }), ordersController.updateLatLng);
    app.put('/api/orders/updateToDelivered',  passport.authenticate('jwt', { session: false }), ordersController.updateToDelivered);
    

}
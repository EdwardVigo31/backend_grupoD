
const usersController=require('../controllers/usersController');
const passport = require('passport');


module.exports=(app, upload) =>{

    // GET -> obtener datos
    //POST -> Almacenar datos
    //PUT -> ACTUALIZAR datos
    //DELETE -> Eliminar datos
    app.post('/api/users/create',  usersController.register);
    app.post('/api/users/createWithImage',upload.array('image',1), usersController.registerWithImage);
    app.post('/api/users/login', usersController.login);
    app.put('/api/users/update',passport.authenticate('jwt',{session:false}),upload.array('image',1),usersController.updateWithImage);
    app.put('/api/users/updateWithoutImage',passport.authenticate('jwt',{session:false}), usersController.updateWithoutImage);
    app.get('/api/users/findDeliveryMen', passport.authenticate('jwt', { session: false }), usersController.findDeliveryMen);
    app.put('/api/users/updateNotificationToken', passport.authenticate('jwt', { session: false }), usersController.updateNotificationToken);
    

    


}
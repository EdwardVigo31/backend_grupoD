
const addressController=require('../controllers/addressController');
const passport = require('passport');


module.exports=(app) =>{

    // GET -> obtener datos
    //POST -> Almacenar datos
    //PUT -> ACTUALIZAR datos
    //DELETE -> Eliminar datos
    app.get('/api/address/findByUser/:id_user',passport.authenticate('jwt',{session:false}),  addressController.findByUser);
    app.post('/api/address/create',passport.authenticate('jwt',{session:false}),  addressController.create);

}
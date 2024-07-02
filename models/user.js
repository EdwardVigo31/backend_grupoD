const { use } = require('passport');
const db = require('../config/config');
const bcrypt = require('bcryptjs');

const User={};

User.findById = (id,result) =>{
    const sql = `
    SELECT
        CONVERT(U.id, char) AS id,
        U.email,
        U.name,
        U.lastname,
        U.phone,
        U.image,
        U.password,
        U.notification_token,
        json_arrayagg(
            json_object(
                'id', CONVERT(R.id, char),
                'name', R.name,
                'image', R.image,
                'route', R.route
            )
        ) AS roles
    FROM
        users AS U
    INNER JOIN
        user_has_roles AS UHR
    ON
        UHR.id_user = U.id
    INNER JOIN
        roles AS R
    ON
        UHR.id_rol = R.id
    WHERE
        U.id = ?
    GROUP BY
        U.id;

    `;
    db.query(
        sql,
        [id],
        (err,user) =>{
            if(err){
              console.log('Error:', err);
              result(err,null);
  
            }
            else{
              console.log('El Usuario obtenido', user[0]);
              result(null,user[0]);
            } 
          }

    )
}

User.findByEmail = (email,result) =>{
    const sql = `
    SELECT
        U.id,
        U.email,
        U.name,
        U.lastname,
        U.phone,
        U.image,
        U.password,
        json_arrayagg(
            json_object(
                'id',CONVERT(R.id, char),
                'name', R.name,
                'image', R.image,
                'route', R.route
            )
        ) AS roles
    FROM
        users AS U
    INNER JOIN
        user_has_roles AS UHR
    ON
        UHR.id_user = U.id
    INNER JOIN
        roles AS R
    ON
        UHR.id_rol = R.id
    WHERE
        email = ?
    GROUP BY
        U.id;

    `;
    db.query(
        sql,
        [email],
        (err,user) =>{
            if(err){
              console.log('Error:', err);
              result(err,null);
  
            }
            else{
              console.log('El Usuario obtenido', user[0]);
              result(null,user[0]);
            } 
          }

    )
}


User.create = async (user,result) =>{

    const hash = await bcrypt.hash(user.password, 10); 
    
    const sql = `
        INSERT INTO
            users(
                email,
                name,
                lastname,
                phone,
                image,
                password,
                created_at,
                updated_at
            )
        VALUES(?,?,?,?,?,?,?,?) 
    `;
    db.query(
        sql,
        [
            user.email,
            user.name,
            user.lastname,
            user.phone,
            user.image,
            hash,
            new Date(),
            new Date()
        ],
        (err,res) =>{
          if(err){
            console.log('Error:', err);
            result(err,null);

          }
          else{
            console.log('Id del nuevo usuario: ', res.insertId);
            result(null,res.insertId);
          } 
        }
    ) 
};
User.update = async (user, result) => {
    const sql = `
        UPDATE
            users
        SET
            email = ?,
            name = ?,
            lastname = ?,
            phone = ?,
            image = ?,
            password = ?,
            updated_at = ?
        WHERE
            id = ?
    `;

    if (user.password) {
        // Si se proporciona una nueva contraseña, haz hash y actualiza
        const hash = await bcrypt.hash(user.password, 10);
        db.query(
            sql,
            [
                user.email,
                user.name,
                user.lastname,
                user.phone,
                user.image,
                hash, // Almacena la contraseña con hash
                new Date(),
                user.id
            ],
            (err, res) => {
                if (err) {
                    console.log('Error:', err);
                    result(err, null);
                } else {
                    console.log('Usuario Actualizado: ', user.id);
                    User.findById(user.id, (err, data) => {
                        if (err) {
                            console.log('Error:', err);
                            result(err, null);
                        } else {
                            result(null, user.id);
                        }
                    });
                }
            }
        );
    } else {
        // Si no se proporciona una nueva contraseña, obtén la existente
        User.findById(user.id, (err, data) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            } else {
                db.query(
                    sql,
                    [
                        user.email,
                        user.name,
                        user.lastname,
                        user.phone,
                        user.image,
                        data.password, // Usa la contraseña existente
                        new Date(),
                        user.id
                    ],
                    (err, res) => {
                        if (err) {
                            console.log('Error:', err);
                            result(err, null);
                        } else {
                            console.log('Usuario Actualizado: ', user.id);
                            result(null, user.id);
                        }
                    }
                );
            }
        });
    }
};


User.updateWithoutImage = async (user, result) => {
    const sql = `
        UPDATE
            users
        SET
            email = ?,
            name = ?,
            lastname = ?,
            phone = ?,
            password = ?,
            updated_at = ?
        WHERE
            id = ?
    `;

    if (user.password) {
        // Si se proporciona una nueva contraseña, haz hash y actualiza
        const hash = await bcrypt.hash(user.password, 10);
        db.query(
            sql,
            [
                user.email,
                user.name,
                user.lastname,
                user.phone,
                hash,
                new Date(),
                user.id
            ],
            (err, res) => {
                if (err) {
                    console.log('Error:', err);
                    result(err, null);
                } else {
                    console.log('Usuario Actualizado: ', user.id);
                    User.findById(user.id, (err, data) => {
                        if (err) {
                            console.log('Error:', err);
                            result(err, null);
                        } else {

                            result(null, user.id);
                        }
                    });
                }
            }
        );
    } else {
        // Si no se proporciona una nueva contraseña, obtén la existente
        User.findById(user.id, (err, data) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            } else {
                db.query(
                    sql,
                    [
                        user.email,
                        user.name,
                        user.lastname,
                        user.phone,
                        data.password,
                        new Date(),
                        user.id
                    ],
                    (err, res) => {
                        if (err) {
                            console.log('Error:', err);
                            result(err, null);
                        } else {
                            console.log('Usuario Actualizado: ', user.id);
                            User.findById(user.id, (err, data) => {
                                if (err) {
                                    console.log('Error:', err);
                                    result(err, null);
                                } else {
                                    result(null, user.id);
                                }
                            });
                        }
                    }
                );
            }
        });
    }
};

User.findDeliveryMen = (result) => {
    const sql = `
    SELECT
        CONVERT(U.id, char) AS id,
        U.email,
        U.name,
        U.lastname,
        U.image,
        U.phone
    FROM
        users AS U
    INNER JOIN
        user_has_roles AS UHR
    ON
        UHR.id_user = U.id 
    INNER JOIN
        roles AS R
    ON
        R.id = UHR.id_rol
    WHERE
        R.id = 2;
    `;

    db.query(
        sql,
        (err, data) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                result(null, data);
            }
        }
    );
};
User.findAdmins = (result) => {
    const sql = `
    SELECT
        CONVERT(U.id, char) AS id,
        U.name,
        U.notification_token
    FROM
        users AS U
    INNER JOIN
        user_has_roles AS UHR
    ON
        UHR.id_user = U.id
    
    INNER JOIN
        roles AS R
    ON
        R.id = UHR.id_rol
    WHERE
        R.id = 1
        `;

    db.query(
        sql,
        (err, data) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                result(null, data);
            }
        }
    );
},
User.updateNotificationToken = (id, token, result) => {

    const sql = `
    UPDATE
        users
    SET
        notification_token = ?,
        updated_at = ?
    WHERE
        id = ?
    `;

    db.query
    (
        sql,
        [
            token,
            new Date(),
            id
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                result(null, id);
            }
        }
    )
}


    


module.exports=User;
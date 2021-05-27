/* 
Imports
*/
    const bcrypt = require('bcryptjs');
    const Models = require('../models/index');
    const { cryptData, decryptData } = require('../services/crypto.service');
//

/* 
Functions
*/
    // CRUD: create one
    const register = req => {
        return new Promise( (resolve, reject) => {
            // [RGPD] crypt user data
            req.body.firstname = cryptData(req.body.firstname);
            req.body.lastname = cryptData(req.body.lastname);

            // [Bcrypt] password
            bcrypt.hash( req.body.password, 10 )
            .then( hashedPassword => {
                // Change user password
                req.body.password = hashedPassword;

                // Register new user
                Models.user.create(req.body)
                .then( data => resolve(data) )
                .catch( err => reject(err) )
            })
            .catch( bcryptError => reject(bcryptError))
        })
    }

    const login = (req, res) => {
        return new Promise( (resolve, reject) => {
            // Get all post from MongoDB
            Models.user.findOne( { email: req.body.email } )
            .then( data => {
                // Check password
                const passwordValisation = bcrypt.compareSync( req.body.password, data.password );
                if( passwordValisation) {
                    // Decrypt user info
                    const decryptedUser = decryptData(data, 'firstname', 'lastname');

                    // Set user JWT
                    const userToken = data.generateJwt(data);

                    // Save JWT in the cookie response
                    res.cookie(process.env.COOKIE_NAME, userToken, { httpOnly: true });

                    // Return data
                    return resolve(decryptedUser)
                }
                else{ return reject('Password not valide') }
            })
            .catch( err => reject(err) )
        })
    }
//

/* 
Export
*/
    module.exports = {
        register,
        login
    }
//
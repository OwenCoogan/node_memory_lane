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
            req.body.firstname = cryptData(req.body.firstname);
            req.body.lastname = cryptData(req.body.lastname);
            bcrypt.hash( req.body.password, 10 )
            .then( hashedPassword => {
                req.body.password = hashedPassword;
                Models.user.create(req.body)
                .then( data => resolve(data) )
                .catch( err => reject(err) )
            })
            .catch( bcryptError => reject(bcryptError))
        })
    }

    const login = (req, res) => {
        return new Promise( (resolve, reject) => {
            Models.user.findOne( { email: req.body.email } )
            .then( data => {
                const passwordValidation = bcrypt.compareSync( req.body.password, data.password );
                if( passwordValidation) {
                    const userToken = data.generateJwt(data);
                    const payload = {
                        user : decryptData(data, 'firstname', 'lastname'),
                        accessToken: userToken
                    }
                    res.cookie(process.env.COOKIE_NAME, userToken);
                    return resolve(payload)
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

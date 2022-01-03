/*
Imports
*/
    // Node
    const express = require('express');
    const Controllers = require('../controller/index');
    const { signAccessToken } = require('../helpers/jwtHelper')
//

/*
Defintiion
*/
    class RouterClass{
        constructor( { passport } ){
            this.router = express.Router();
            this.passport = passport
        }

        routes(){
            // Define API route to register user
            this.router.post('/register', (req, res) => {
                // TODO: check body data
                Controllers.auth.register(req)
                .then( apiResponse => res.json( { data: apiResponse, err: null } ))
                .catch( apiError => res.json( { data: null, err: apiError } ))
            })

            this.router.post('/login', (req, res) => {
                Controllers.auth.login(req, res)
                .then( apiResponse => res.json( { data: apiResponse , err: null } ))
                .catch( apiError => res.json( { data: null, err: apiError }))
            })
            // Define AUTH route to get user info from JWT
            this.router.get('/me', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                //
            })
        }

        init(){
            // Get route fonctions
            this.routes();

            // Sendback router
            return this.router;
        }
    }

//

/*
Export
*/
    module.exports = RouterClass;
//

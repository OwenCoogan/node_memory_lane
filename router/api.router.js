/*
Imports
*/
    // Node
    const express = require('express');
    const Controllers = require('../controller/index');
    const multer = require('multer');
    const fs = require('fs');
//
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, 'uploads')
        },
        filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
        }
    })

    var upload = multer({ storage: storage })

/*
Defintiion
*/
    class RouterClass{
        constructor({ passport }){
            this.router = express.Router();
            this.passport = passport;
        }

        routes(){

            this.router.get('/posts/', (req, res) => {
                Controllers.post.readAll()
                .then( apiResponse => res.json( { data: apiResponse, err: null } ))
                .catch( apiError => res.json( { data: null, err: apiError } ))
            })
            this.router.post('/posts/upload/:id', upload.single('picture'), (req, res) => {
                var img = fs.readFileSync(req.file.path);
                var encode_image = img.toString('base64');
             // Define a JSONobject for the image attributes for saving to database

             var finalImg = {
                  contentType: req.file.mimetype,
                  image:  new Buffer(encode_image, 'base64')
               };
            db.collection('images').insertOne(finalImg, (err, result) => {
                  console.log(result)

                if (err) return console.log(err)

                console.log('saved to database')
                res.redirect('/')
              })
            })
            // Define API route to create on data
            this.router.post('/post/create', (req, res) => {
            // TODO: check body data
                Controllers.post.createOne(req)
                .then(req => console.log(req))
                .then( apiResponse => res.json( { data: apiResponse, err: null }))
                .catch( apiError => res.json( { data: null, err: apiError } ))
            })
            this.router.get('/posts/', this.passport.authenticate('jwt', { session: false }), ( res) => {
                Controllers.post.readAll()
                .then( apiResponse => res.json( { data: apiResponse, err: null } ))
                .catch( apiError => res.json( { data: null, err: apiError } ))
            })
            this.router.get('/posts/:id', ( req,res) => {
                Controllers.post.readOne(req)
                .then( apiResponse => res.json( { data: apiResponse, err: null } ))
                .catch( apiError => res.json( { data: null, err: apiError } ))
            })


            // Define API route to get all data
            this.router.get('/:endpoint', (req, res) => {
                // User the controller to get data
                Controllers[req.params.endpoint].readAll()
                .then( apiResponse => res.json( { data: apiResponse, err: null } ))
                .catch( apiError => res.json( { data: null, err: apiError } ))
            })

            // Define API route to update one data
            this.router.put('/:endpoint/:id', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                console.log(req.user)
                // TODO: check body data
                // User the controller to get data
                Controllers[req.params.endpoint].updateOne(req)
                .then( apiResponse => res.json( { data: apiResponse, err: null } ))
                .catch( apiError => res.json( { data: null, err: apiError } ))
            })

            // Define API route to delete one data
            this.router.delete('/:endpoint/:id', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                // User the controller to get data
                // TODO: check id user can update
                Controllers[req.params.endpoint].deleteOne(req)
                .then( apiResponse => res.json( { data: apiResponse, err: null } ))
                .catch( apiError => res.json( { data: null, err: apiError } ))
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

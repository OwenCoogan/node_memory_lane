/* 
Imports
*/
    // Node
    const express = require('express');
    // Inner 
    const Controllers = require('../controller/index');
//

/* 
Defintiion
*/
    class RouterClass{
        constructor({ passport }){
            this.router = express.Router();
            this.passport = passport;
        }

        routes(){
            // TODO: create CRUD routes
            this.router.get('/api/posts', (req, res) => {
                Controllers.post.readAll()
                .then (apiResponse => {
                    console.log(apiResponse)
                    res.send(apiResponse)
                })
                .catch( apiError => {
                    // Render edit vue with error
                    res.send(apiError)
                })
            })

            this.router.get('/api/post/:id', (req, res) => {
                // Get all posts from the BDD
                Controllers.post.readOne(req)
                .then (apiResponse => {
                    console.log(apiResponse)
                    res.send(apiResponse)
                })
                .catch( apiError => {
                    // Render edit vue with error
                    res.send(apiError)
                    console.log(apiError)
                })
            })
            
            
            // Define backoffice route for index
            this.router.get('/', this.passport.authenticate('jwt', { 
                session: false, 
                failureRedirect: '/login' 
            }), (req, res) => {
                // Get all posts from the BDD
                Controllers.post.readAll()
                .then( apiResponse => {
                    // Render index vue with data
                    return res.render('index', { 
                        msg: 'Posts found', 
                        method: req.method,
                        err: null, 
                        data: apiResponse,
                        url: req.originalUrl,
                        status: 200
                    })
                })
                .catch( apiError => {
                    // Render index vue with error
                    return res.render('index', { 
                        msg: 'Posts found', 
                        method: req.method,
                        err: apiError, 
                        data: null,
                        url: req.originalUrl,
                        status: 404
                    })
                })
            })

            // Define backoffice route for index
            this.router.get('/register', (req, res) => {
                return res.render('register', { 
                    msg: 'Register page', 
                    method: req.method,
                    err: null, 
                    data: null,
                    url: req.originalUrl,
                    status: 200
                })
            })

            this.router.post('/register', (req, res) => {
                Controllers.auth.register(req)
                .then( apiResponse => {
                    console.log(apiResponse)
                    // Render index vue with data
                    return res.redirect('/')
                })
                .catch( apiError => {
                    // Render index vue with error
                    return res.render('register', { 
                        msg: 'User not registered', 
                        method: req.method,
                        err: apiError, 
                        data: null,
                        url: req.originalUrl,
                        status: 404
                    })
                })
            })

            // Define backoffice route for index
            this.router.get('/login', (req, res) => {
                return res.render('login', { 
                    msg: 'Login page', 
                    method: req.method,
                    err: null, 
                    data: null,
                    url: req.originalUrl,
                    status: 200
                })
            })

            this.router.post('/login', (req, res) => {
                Controllers.auth.login(req, res)
                .then( apiResponse => {
                    console.log(apiResponse)
                    // Render index vue with data
                    return res.redirect('/')
                })
                .catch( apiError => {
                    // Render index vue with error
                    return res.render('login', { 
                        msg: 'User not logged', 
                        method: req.method,
                        err: apiError, 
                        data: null,
                        url: req.originalUrl,
                        status: 404
                    })
                })
            })

            this.router.get('/me', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                return res.json(req.user._id)
            })

            // Define backoffice route to display form to create new post
            this.router.get('/post/create', (req, res) => {
                // Render edit vue with data
                return res.render('create', { 
                    msg: 'Display vue create', 
                    method: req.method,
                    err: null, 
                    data: { title:undefined, content: undefined },
                    url: req.originalUrl,
                    status: 200
                })
            })

            // Define backoffice route to create new post
            this.router.post('/post/create', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                // Get all posts from the BDD
                Controllers.post.createOne(req)
                .then( apiResponse => {
                    // Redirect to edit page
                    return res.redirect(`/post/edit/${apiResponse._id}`)
                })
                .catch( apiError => {
                    // Render create vue with error
                    return res.render('create', { 
                        msg: 'Posts not created', 
                        method: req.method,
                        err: apiError, 
                        data: { title: undefined, content: undefined },
                        url: req.originalUrl,
                        status: 404
                    })
                })
            })

            // Define backoffice route to display edit vue
            this.router.get('/post/edit/:id', (req, res) => {
                // Get all posts from the BDD
                Controllers.post.readOne(req)
                .then( apiResponse => {
                    // Render edit vue with data
                    return res.render('edit', { 
                        msg: 'Post found', 
                        method: req.method,
                        err: null, 
                        data: apiResponse,
                        url: req.originalUrl,
                        status: 200
                    })
                })
                .catch( apiError => {
                    // Render edit vue with error
                    return res.render('edit', { 
                        msg: 'Post not found', 
                        method: req.method,
                        err: apiError, 
                        data: null,
                        url: req.originalUrl,
                        status: 404
                    })
                })
            })

            // Define backoffice route to update a post
            this.router.post('/post/edit/:id', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                // Get all posts from the BDD
                Controllers.post.updateOne(req)
                .then( apiResponse => {
                    // Fetch post
                    Controllers.post.readOne(req)
                    .then( postData => {
                        // Render edit vue with data
                        return res.render('edit', { 
                            msg: 'Post found', 
                            method: req.method,
                            err: null, 
                            data: postData,
                            url: req.originalUrl,
                            status: 200
                        })
                    })
                    .catch( postError => {
                        // Render edit vue with data
                        return res.render('edit', { 
                            msg: 'Post not found', 
                            method: req.method,
                            err: postError, 
                            data: {title: undefined, content: undefined},
                            url: req.originalUrl,
                            status: 200
                        })
                    })
                    
                })
                .catch( apiError => {
                    // Render edit vue with error
                    return res.render('edit', { 
                        msg: 'Post not updated', 
                        method: req.method,
                        err: apiError, 
                        data: null,
                        url: req.originalUrl,
                        status: 404
                    })
                })
            })

            // Define backoffice route to delete one post
            this.router.get('/post/delete/:id', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                // Get all posts from the BDD
                Controllers.post.deleteOne(req)
                .then( apiResponse => {
                    console.log(apiResponse)

                    // Redirect to index vue
                    return res.redirect('/');
                })
                .catch( apiError => {
                    // TODO: do something with error
                    console.log(apiError)

                    // Redirect to index vue
                    return res.redirect('/');
                })
            })
            
            // Define route to display one single post
            this.router.get('/post/:id', (req, res) => {
                // Get all posts from the BDD
                Controllers.post.readOne(req)
                .then( apiResponse => {
                    // Render edit vue with data
                    return res.render('single', { 
                        msg: 'Post found', 
                        method: req.method,
                        err: null, 
                        data: apiResponse,
                        url: req.originalUrl,
                        status: 200
                    })
                })
                .catch( apiError => {
                    // Render edit vue with error
                    return res.render('single', { 
                        msg: 'Post not found', 
                        method: req.method,
                        err: apiError, 
                        data: null,
                        url: req.originalUrl,
                        status: 404
                    })
                })
            })

            // Define route to create comment
            this.router.post('/comment/:postId', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                Controllers.comment.createOne(req)
                .then( apiResponse => {
                    console.log(apiResponse)

                    // Redirect to post page
                    return res.redirect(`/post/${req.params.postId}`)
                })
                .catch( apiError => {
                    // TODO: check errors
                    console.log(apiError)

                    // Redirect to post page
                    return res.redirect(`/post/${req.params.postId}`)
                })
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
/* 
Imports
*/
    const Models = require('../models/index');
    const { cryptData, decryptData } = require('../services/crypto.service');
//

/* 
Functions
*/
    // CRUD: create one
    const createOne = req => {
        return new Promise( (resolve, reject) => {
            // Create new object
            Models.post.create(req.body)
            .then( data => resolve(data) )
            .catch( err => reject(err) )
        })
    }

    // CRUD: read all posts
    const readAll = () => {
        return new Promise( (resolve, reject) => {
            // Make populated request
            Models.post.find()
            .populate({ 
                path: 'author',
                select: ['firstname', 'lastname', 'email']
            })
            .populate({ path: 'comment' })
            .exec( (err, data) => {
                // Check error
                if( err ){ return reject(err) }
                else{
                    // Decrypt user data
                    decryptData(data.author, 'firstname', 'lastname')

                    // Send back data
                    return resolve(data)
                }
            })
        })
    }

    // CRUD: read one
    const readOne = req => {
        return new Promise( (resolve, reject) => {
            // Make populated request
            Models.post.findById(req.params.id)
            .populate({ 
                path: 'author'
            })
            .populate({ 
                path: 'comments' ,
                populate: { 
                    path: 'author'
                }
            })
            .exec( (err, data) => {
                // Check error
                if( err ){ return reject(err) }
                else{
                    // Decrypt user data
                    decryptData(data.author, 'firstname', 'lastname')

                    console.log(data)

                    // Send back data
                    return resolve(data)
                }
            })
        })
    }

    // CRUD: update one
    const updateOne = req => {
        return new Promise( (resolve, reject) => {
            // Get single post
            Models.post.findById(req.params.id, (err, mongoPost) => {
                // Check error
                if( err ){ return reject(err) }
                else{
                    // Check author
                    if( mongoPost.author === req.user._id ){
                        
                        // Get all post from MongoDB
                        Models.post.findByIdAndUpdate(req.params.id, req.body, (err, data) => {
                            // Check err
                            
                            return err
                            ? reject(err)
                            : resolve(data)
                        })
                    }
                    else{ return reject('Unauthorized') };
                }
            })
        })
    }

    // CRUD: delete one
    const deleteOne = req => {
        return new Promise( (resolve, reject) => {
            // Get all post from MongoDB
            Models.post.deleteOne({ _id: req.params.id, author: req.user._id }, (err, data) => {
                // Check err
                return err
                ? reject(err)
                : resolve(data)
            })
        })
    }

//

/* 
Export
*/
    module.exports = {
        createOne,
        readAll,
        readOne,
        updateOne,
        deleteOne
    }
//
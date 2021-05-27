/* 
Imports
*/
    const Models = require('../models/index')
//

/* 
Functions
*/
    // CRUD: read all comments
    const createOne = (req) => {
        return new Promise( (resolve, reject) => {
            // Inject body data
            req.body.author = req.user._id;
            req.body.isPartOf = req.params.postId;

            // Create comment
            Models.comment.create(req.body)
            .then( async commentData => {
                // Update post
                const updatedPost = await Models.post.findByIdAndUpdate(req.params.postId, { $push: { comments: commentData._id } })
                
                return resolve({ comment: commentData, updated: updatedPost })
            })
            .catch( commentError => reject(commentError) )
        })
    }

    // CRUD: read all comments
    const readAll = () => {
        return new Promise( (resolve, reject) => {
            // Get all comment from MongoDB
            Models.comment.find( (err, data) => {
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
        readAll
    }
//
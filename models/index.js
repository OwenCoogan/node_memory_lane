const { Model } = require('mongoose')

/* 
Definition
*/
    const Models = {
        post: require('./post.model'),
        user: require('./user.model'),
        comment: require('./comment.model'),
    }
//

/* 
Export
*/
    module.exports = Models;
//
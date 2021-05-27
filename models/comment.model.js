/* 
Imports
*/
    const mongoose = require('mongoose');  //=> https://www.npmjs.com/package/mongoose
    const { Schema } = mongoose;
//

/* 
Definition
*/
    const MySchema = new Schema({
        content: String,
        
        isPartOf: {
            type: Schema.Types.ObjectId,
            ref: 'post'
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        dateCreated: {
            type: Date,
            default: new Date()
        }
    })
//

/* 
Exports
*/
    const MyModel = mongoose.model('comment', MySchema);
    module.exports = MyModel;
//
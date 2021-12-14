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
        title: { type: String },
        content: { type: String },

        comments: [{
            type: Schema.Types.ObjectId,
            ref: 'comment'
        }],

        // Always use those properties
        author: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        dateCreated: {
            type: Date,
            default: new Date()
        },
        dateUpdated: {
            type: Date,
            default: null
        },
        gpsPositionLat: {
            type: String,
            default: null
        },
        gpsPositionLong: {
            type: String,
            default: null
        }
    })
//

/*
Exports
*/
    const MyModel = mongoose.model('post', MySchema);
    module.exports = MyModel;
//

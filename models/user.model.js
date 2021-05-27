/* 
Imports
*/
    const jwt = require('jsonwebtoken'); //=> https://www.npmjs.com/package/jsonwebtoken
    const mongoose = require('mongoose'); //=> https://www.npmjs.com/package/mongoose
    const { Schema } = mongoose;
//

/* 
Definition
*/
    const MySchema = new Schema({
        email: { 
            unique: true, 
            type: String 
        },
        password: String,
        firstname: String,
        lastname: String,
        
        dateCreated: {
            type: Date,
            default: new Date()
        },
        lastConnection: {
            type: Date,
            default: new Date()
        }
    })
//

/* 
Methods
*/
    MySchema.methods.generateJwt = user => {
        // Set expiration
        const expiryToken = new Date();
        expiryToken.setDate( expiryToken.getDate() + 59 );

        // Set token
        const jwtObject = {
            _id: user._id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            lastConnection: user.lastConnection,

            // Set timeout
            expireIn: '5s',
            exp: parseInt( expiryToken.getTime() / 100, 10 )
        }

        // Retunr JWT
        return jwt.sign( jwtObject, process.env.JWT_SECRET );
    };
//

/* 
Exports
*/
    const MyModel = mongoose.model('user', MySchema);
    module.exports = MyModel;
//
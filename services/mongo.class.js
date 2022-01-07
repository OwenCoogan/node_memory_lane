/*
Import
*/
    const mongoose = require('mongoose'); //=> https://www.npmjs.com/package/mongoose
//

/*
Define classe
*/
    class MongoClass{
        // Inject value
        constructor(){
            this.mongoUrl = process.env.MONGO_URL;
        }

        // Start connection
        connectDb(){
            return new Promise( (resolve, reject) => {
                mongoose.connect( this.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true  } )
                .then( db => resolve( { db: db, url: this.mongoUrl } ) )
                .catch( dbError => reject( 'MongoDB not connected', dbError ) )
            });
        }
    }
//

/*
Export
*/
    module.exports = MongoClass;
//

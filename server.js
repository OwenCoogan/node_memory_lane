/* 
Imports
*/
    // Node
    require('dotenv').config(); //=> https://www.npmjs.com/package/dotenv
    const express = require('express'); //=> https://www.npmjs.com/package/express
    const path = require('path'); //=> https://www.npmjs.com/package/path
    const bodyParser = require('body-parser'); //=> https://www.npmjs.com/package/body-parser
    const cookieParser = require('cookie-parser'); //=> https://www.npmjs.com/package/cookie-parser
    const passport = require('passport'); //=> https://www.npmjs.com/package/passport

    // Inner
    const MongoClass = require('./services/mongo.class')
    const PostModel = require('./models/post.model');
//


/* 
Server definition
*/
    class ServerClass{
        // Inject properties in the ServerClass
        constructor(){
            this.server = express();
            this.port = process.env.PORT;
            this.mongDb = new MongoClass();
        }

        init(){
            // Set CORS
            this.server.use( (req, res, next) => {
                // Define allowed origins
                const allowedOrigins = process.env.ALLOWED_ORIGINS.split(', ');
                const origin = req.headers.origin;

                // Setup CORS
                if(allowedOrigins.indexOf(origin) > -1){ res.setHeader('Access-Control-Allow-Origin', origin)}
                res.header('Access-Control-Allow-Credentials', true);
                res.header('Access-Control-Allow-Methods', ['GET', 'PUT', 'POST', 'DELETE']);
                res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

                // Use next() function to continue routing
                next();
            });
            
            // Static path configuration
            this.server.set( 'views', __dirname + '/www' );
            this.server.use( express.static(path.join(__dirname, 'www')) );

            // Set server view engine
            this.server.set( 'view engine', 'ejs' );

            //=> Body-parser
            this.server.use(bodyParser.json({limit: '20mb'}));
            this.server.use(bodyParser.urlencoded({ extended: true }));

            //=> Use CookieParser to setup serverside cookies
            this.server.use(cookieParser(process.env.COOKIE_SECRET));

            // Start config
            this.config();
        }

        config(){
            // Set authentication
            const { setAuthentication } = require('./services/passport.service');
            setAuthentication(passport);

            // Set up AUTH router
            const AuthRouterClass = require('./router/auth.router');
            const authRouter = new AuthRouterClass( { passport } );
            this.server.use('/v1/auth', authRouter.init());

            // Set up API router
            const ApiRouterClass = require('./router/api.router');
            const apiRouter = new ApiRouterClass({ passport });
            this.server.use('/v1', apiRouter.init());

            // Set up Backoffice router
            const BackRouterClass = require('./router/backoffice.router');
            const backRouter = new BackRouterClass({ passport });
            this.server.use('/', backRouter.init());

            // Start server
            this.launch();
        }

        launch(){
            // Connect MongoDB
            this.mongDb.connectDb()
            .then( db => {
                // Start server
                this.server.listen( this.port, () => {
                    console.log({
                        node: `http://localhost:${this.port}`,
                        db: db.url,
                    })
                })
            })
            .catch( dbError => {
                console.log(dbError)
            })
        }
    }
//


/* 
Start server
*/
    const MyServer = new ServerClass();
    MyServer.init();
//
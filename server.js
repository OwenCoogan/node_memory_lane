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
    const https = require('https');

    // Inner
    const MongoClass = require('./services/mongo.class')
    const fs = require(`fs`);

    const options = {
    key: fs.readFileSync(`server.key`),
    cert: fs.readFileSync(`server.cert`)
    };
/*
Server definition
*/
    class ServerClass{
        // Inject properties in the ServerClass
        constructor(){
            this.server = express();
            this.port = process.env.PORT;
            this.mongoDb = new MongoClass();
        }

        init(){
            this.server.use( (req, res, next) => {
                const allowedOrigins = process.env.ALLOWED_ORIGINS.split(', ');
                const origin = req.headers.origin;
                if(allowedOrigins.indexOf(origin) > -1){ res.setHeader('Access-Control-Allow-Origin', origin)}
                res.header('Access-Control-Allow-Credentials', true);
                res.header('Access-Control-Allow-Methods', ['GET', 'PUT', 'POST', 'DELETE']);
                res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
                next();
            });

            this.server.set( 'views', __dirname + '/www' );
            this.server.use( express.static(path.join(__dirname, 'www')) );

            this.server.set( 'view engine', 'ejs' );

            this.server.use(bodyParser.json({limit: '20mb'}));
            this.server.use(bodyParser.urlencoded({ extended: true }));

            this.server.use(cookieParser(process.env.COOKIE_SECRET));
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
            this.mongoDb.connectDb()
            .then( db => {
                this.server.createServer(options, (req, res) => {
                }).this.server.listen( this.port, () => {
                    console.log({
                        node: `http://localhost:${this.port}`,
                        db: db.url,
                    })
                });


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

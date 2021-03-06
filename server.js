/*
Imports
*/
    // Modules
    require('dotenv').config();
    const express = require('express');
    const bodyParser = require('body-parser');
    const ejs = require('ejs');
    const path = require('path');

    const MONGOclass = require('./services/mongo.class');
//


/*
Declarations
*/
const server = express();
const port = process.env.PORT;
//

server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader("Access-Control-Allow-Headers", "Origin, Accept, X-Access-Token, Authorization, X-Requested-With, Content-Type, Access-Control-Request-Headers");
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader("Access-Control-Allow-Credentials", "true");

  next();
});

/*
Server class
*/
class ServerClass{
    constructor(){
      this.MONGO = new MONGOclass;
    }

    init(){

      // View engine configuration
      server.engine( 'html', ejs.renderFile );
      server.set( 'view engine', 'html' );

      // Static path configuration
      server.set( 'views', __dirname + '/www' );
      server.use( express.static(path.join(__dirname, 'www')) );

      //=> Body-parser
      server.use(bodyParser.json({limit: '10mb'}));
      server.use(bodyParser.urlencoded({ extended: true }));

        // Start config
        this.config()
    };

    config(){

      // Set routers
      const userRoutes = require('./routers/user.router');
      const practiceRoutes = require('./routers/practice.router');
      const goalRoutes = require('./routers/goal.router');
      const workoutRoutes = require('./routers/workout.router');

      server.use('/api/auth/', userRoutes);
      server.use('/api/practice', practiceRoutes);
      server.use('/api/goal', goalRoutes);
      server.use('/api/workout', workoutRoutes);


      // Set front router
      server.get('/*',  (req, res) => res.render('index') );

        // Lauch server
        this.launch()
    };

    launch(){
      // Connect MongoDB
      this.MONGO.connectDb()
      .then( db => {
          // Start server
          server.listen(port, () => {
              console.log({
                  node: `http://localhost:${port}`,
                  mongo: db.url
              });
          });
      })
      .catch( dbErr => console.log('MongoDB Error', dbErr));
  };
}
//

/*
Start server
*/
const NODEapi = new ServerClass();
NODEapi.init();
//
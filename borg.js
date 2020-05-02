/* ===================================================================================
   We are the Borg 2020
=====================================================================================*/
/* ===================================================================================
   Load Modules
=====================================================================================*/

const Log = require('./lib/logger');
const ENVIRONMENT = require('./lib/constants/environment');

const Hive = require('./borgOS/hive');
const collective = new Hive(ENVIRONMENT.BORG_ID);

const Mind = require('./borgOS/mind');
const borg = new Mind(ENVIRONMENT.BORG_ID);

const express = require('express');
const app = express();

// Body Parser
app.use(express.json());

/* ===================================================================================
   Put the Borg to Work
=====================================================================================*/

borg.work();

/* ===================================================================================
   Listen to the Borg Collective
=====================================================================================*/

collective.listen();

/* ===================================================================================
   Borg API
=====================================================================================*/

// Route files
const routes = require('./routes');

// Mount routers
app.use('/api/v1', routes);

const server = app.listen(ENVIRONMENT.HTTP_PORT, () => {
	Log.info(`app.server.listen.port ${ENVIRONMENT.HTTP_PORT}`);
}); 

/* ===================================================================================
   Unhandled rejection
=====================================================================================*/

// Handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
	Log.error(`process.unhandled.rejection ${err.message}`);
    // Close server and exit process
	server.close(() => {
        borg.kill();    
        process.exit(1);
    })
});

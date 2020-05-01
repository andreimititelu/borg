/* ===================================================================================
   We are the Borg 2020
=====================================================================================*/
/* ===================================================================================
   Load Modules
=====================================================================================*/

const ENVIRONMENT = require('./lib/constants/environment');

const Hive = require('./borgOS/hive');
const collective = new Hive(ENVIRONMENT.BORG_ID);

const Mind = require('./borgOS/mind');
const borg = new Mind(ENVIRONMENT.BORG_ID);

/* ===================================================================================
   Listen to the Borg Hive
=====================================================================================*/

collective.listen();

/* ===================================================================================
   Borg Think
=====================================================================================*/

borg.think();

/* ===================================================================================
   Unhandled rejection
=====================================================================================*/

// Handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
	Log.error(`process.unhandled.rejection ${err.message}`);
	// Close server and exit process
    borg.kill();    
    process.exit(1);
});

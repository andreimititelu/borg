const { v4: uuidv4 } = require('uuid');
const PubSub = require('../lib/pubsub');
const Log = require('../lib/logger');
const ENVIRONMENT = require('../lib/constants/environment');

class Mind {
    constructor () {
        this.id = ENVIRONMENT.BORG_ID;
        this.connect();
    }

    // Connect to Hive
    connect() {
        Log.info(`borg.os.mind.connect`);
    }

    // Listen to Hive 
    listen() {
        Log.info(`borg.os.mind.listen`);
    }

}

module.exports = Mind;
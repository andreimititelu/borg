const redis = require('redis');
const Log = require('../lib/logger');

const RedisSMQ = require('rsmq');
const rsmq = new RedisSMQ({ host: '127.0.0.1', port: 6379, ns: 'rsmq' });

const ENVIRONMENT = require('../lib/constants/environment');
const MESSAGE = require('../lib/constants/message');

class Mind {
	constructor(borgId) {
        this.id = borgId;
        this.name = ENVIRONMENT.BORG_NAME;
		// The Borg Mind will only publish to the Hive
		this.publisher = redis.createClient();
        this.publisher.on('error', (error) => this.handleError(error));
        
        this.init();
	}

	init() {
        Log.info(`borg.os.mind.init`);
       
		rsmq.createQueue({ qname: ENVIRONMENT.QUEUE.MIND }, (err, resp) => {
			if (err) {
				Log.error(`borg.os.mind.init.error ${err}`);
				return;
			}

			if (resp === 1) {
				Log.info(`borg.os.mind.init.success`);
			}
		});
	}

	think() {
		Log.info(`borg.os.mind.think`);
	}

	listQueues() {
		rsmq.listQueues((err, queues) => {
			Log.info(`borg.os.mind.list.queues`);

			if (err) {
				Log.error(`borg.os.mind.list.queues.error ${err}`);
				return;
			} 

			Log.info(`borg.os.mind.list.queues.list ${queues}`);
		});
    }
    
    kill() {
        rsmq.deleteQueue({ qname: ENVIRONMENT.QUEUE.MIND }, (err, resp) => {
            if (err) {
                console.error(err)
                return
            }
        
            if (resp === 1) {
                console.log("Queue and all messages deleted.")
            } else {
                console.log("Queue not found.")
            }
        });

    }

	publish(channel, message) {
		Log.info(`borg.os.mind.publish ${channel} ${message}`);
		this.publisher.publish(channel, message);
	}
}

module.exports = Mind;

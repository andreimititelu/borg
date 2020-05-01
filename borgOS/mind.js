// Constants
const ENVIRONMENT = require('../lib/constants/environment');
const MESSAGE = require('../lib/constants/message');

// Redis
const redis = require('redis');
const Log = require('../lib/logger');

// Redis SMQ
const RedisSMQ = require('rsmq');
const rsmq = new RedisSMQ({ host: '127.0.0.1', port: 6379, ns: 'rsmq' });

// Redis SMQ Worker
const RSMQWorker = require('rsmq-worker');
const worker = new RSMQWorker(ENVIRONMENT.QUEUE.MIND);

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
				Log.info(`borg.os.mind.init.worker.start`);
				this.worker.start();
			}
		});
	}

	work() {
		Log.info(`borg.os.mind.work`);

		// The Borg Mind Worker
		worker.on('message', (msg, next, id) => this.think(msg, next, id));

		// optional error listeners
		worker.on('error', (err, msg) => this.handleWorkerError(err, msg));
		worker.on('exceeded', (msg) => this.handleWorkerExceeded(msg));
		worker.on('timeout', (msg) => this.handleWorkerTimeout(msg));

		worker.start();
	}

	think(msg, next, id) {
		Log.info(`borg.os.mind.think`);
		Log.info(`borg.os.mind.think.id ${id}`);
		Log.info(`borg.os.mind.think.message ${msg}`);

		const message = JSON.parse(msg);

		switch (message.header.type) {
            
			case MESSAGE.TYPE.CONNECT:
				Log.info(`borg.os.mind.think.message.type.connect ${message.header.borgID}`);
				break;

			case MESSAGE.TYPE.NOTIFICATION:
				Log.info(`borg.os.mind.think.message.type.notification ${message.header.borgID}`);
				break;

			case MESSAGE.TYPE.EVENT:
				Log.info(`borg.os.mind.think.message.type.event ${message.header.borgID}`);
				break;

			case MESSAGE.TYPE.COMMAND:
				Log.info(`borg.os.mind.think.message.type.command ${message.header.borgID}`);
				break;

			case MESSAGE.TYPE.SEARCH:
				Log.info(`borg.os.mind.think.message.type.search ${message.header.borgID}`);
				break;

			case MESSAGE.TYPE.WARNING:
				Log.info(`borg.os.mind.think.message.type.warning ${message.header.borgID}`);
				break;

			case MESSAGE.TYPE.ALERT:
				Log.info(`borg.os.mind.think.message.type.alert ${message.header.borgID}`);
				break;

			default:
				Log.error(`borg.os.mind.think.message.type.unrecognized`);
				break;
		}

		next();
	}

	kill() {
		rsmq.deleteQueue({ qname: ENVIRONMENT.QUEUE.MIND }, (err, resp) => {
			Log.info(`borg.os.mind.kill`);
			if (err) {
				Log.error(`borg.os.mind.kill.error ${err}`);
				return;
			}

			if (resp === 1) {
				Log.info(`borg.os.mind.kill.success`);
			} else {
				Log.warn(`borg.os.mind.kill.not.found`);
			}
		});
	}

	handleWorkerError(err, msg) {
		Log.error(`borg.os.work.handle.error ${err} ${msg.id}`);
	}

	handleWorkerExceeded(msg) {
		Log.warn(`borg.os.work.handle.exceeded ${msg.id}`);
	}

	handleWorkerTimeout(msg) {
		Log.warn(`borg.os.work.handle.timeout ${msg.id} ${msg.rc}`);
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

	publish(channel, message) {
		Log.info(`borg.os.mind.publish ${channel} ${message}`);
		this.publisher.publish(channel, message);
	}
}

module.exports = Mind;

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

// Youtube Suggestion & Search
const suggest = require('suggestion');
const search = require('youtube-search');

// True random number generator
const random = require('random');

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

	work() {
		Log.info(`borg.os.mind.work`);

		// The Borg Mind Worker
		worker.on('message', (msg, next, id) => this.think(msg, next, id));

		// optional error listeners
		worker.on('error', (err, msg) => this.handleWorkerError(err, msg));
		worker.on('exceeded', (msg) => this.handleWorkerExceeded(msg));
		worker.on('timeout', (msg) => this.handleWorkerTimeout(msg));

		Log.info(`borg.os.mind.work.start`);
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

			case MESSAGE.TYPE.SEARCH:
				Log.info(`borg.os.mind.think.message.type.search ${message.header.borgID}`);
				this.search(message);
				break;

			case MESSAGE.TYPE.LEARN:
				Log.info(`borg.os.mind.think.message.type.learn ${message.header.borgID}`);
				this.learn(message);
				break;

			default:
				Log.error(`borg.os.mind.think.message.type.unrecognized`);
				break;
		}

		next();
	}

	search(message) {
		Log.info(`borg.os.mind.search`);

		console.log(message.body.length);

		// Get random search suggestion from list

		const suggestion = message.body[this.getRandomInt(message.body.length - 1)];

		// Send new search message to the hive
		this.createSearchMessage(suggestion);

		console.log(`borg.os.mind.search.suggestion ${suggestion}`);
	}

	createSearchMessage(suggestion) {
		suggest(suggestion, { client: 'youtube' }, (err, suggestions) => {
			if (err) throw err;
			// console.log(suggestions);

			// create only if at least two suggestions so we can keep the search process active

			if (suggestions.length == 1) {
				suggestions = suggestions[0].split(' ');
			}

			const message = {
				header: {
					borgID: this.id,
					status: MESSAGE.STATUS.ONLINE,
					type: MESSAGE.TYPE.SEARCH,
				},
				body: suggestions,
			};

			console.log(message);

			setTimeout(() => this.publish(ENVIRONMENT.CHANNEL.HIVE, JSON.stringify(message)), 10000);
		});
	}

	learn(message) {
		Log.info(`borg.os.mind.learn`);
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
		Log.error(`borg.os.work.handle.error ${err} ${msg.id} ${JSON.stringify(msg)}`);
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

	getRandomInt(limit) {
		let temp = 0;
		const min = random.int(0, limit);
		const max = random.int(0, limit);

		if (min >= max) {
			temp = min;
			min = max;
			max = min;
		}

		return random.int(min, max);
	}
}

module.exports = Mind;

const redis = require('redis');
const Log = require('../lib/logger');
const ENVIRONMENT = require('../lib/constants/environment');
const MESSAGE = require('../lib/constants/message');

class Hive {
	constructor(borgId) {
		this.id = borgId;

        // Connect to HIVE
		this.publisher = redis.createClient();
		this.subscriber = redis.createClient();
		this.publisher.on('error', (error) => this.handleError(error));
		this.subscriber.on('message', (channel, message) => this.handleMessage(channel, message));
        this.subscriber.on('error', (error) => this.handleError(error));
        this.connect();

	}

	// Connect to Hive
	connect() {
		Log.info(`borg.os.hive.connect`);

		const message = {
			header: {
				borgID: this.id,
				status: MESSAGE.STATUS.ONLINE,
				type: MESSAGE.TYPE.CONNECT,
			},
			body: {
				address: ENVIRONMENT.HTTP_ADDRESS,
				port: ENVIRONMENT.HTTP_PORT,
			},
		};

		this.publish(ENVIRONMENT.CHANNEL.HIVE, JSON.stringify(message));
	}

	// Listen to Hive
	listen() {
		Log.info(`borg.os.hive.listen`);
		this.subscribe(ENVIRONMENT.CHANNEL.HIVE);
	}

	handleMessage(channel, message) {
        Log.info(`borg.os.hive.handle.message ${channel} ${message}`);

        // Save to local WORK queue
     
	}

	handleError(error) {
		Log.error(`borg.os.hive.handle.error ${error}`);
	}

	subscribeToChannels(channels) {
		Object.values(channels).forEach((channel) => {
			this.subscriber.subscribe(channel);
		});
	}

	publish(channel, message) {
		Log.info(`borg.os.hive.publish ${channel} ${message}`);
		this.publisher.publish(channel, message);
	}

	subscribe(channel) {
		Log.info(`borg.os.hive.subscribe ${channel}`);
		this.subscriber.subscribe(channel);
	}
}

module.exports = Hive;

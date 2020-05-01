const redis = require('redis');
const Log = require('./logger');

class PubSub {
	constructor() {
		this.publisher = redis.createClient();
		this.subscriber = redis.createClient();

		this.publisher.on('error', (error) => this.handleError(error));
		this.subscriber.on('message', (channel, message) => this.handleMessage(channel, message));
		this.subscriber.on('error', (error) => this.handleError(error));

	}

	handleMessage(channel, message) {
		Log.info(`Message received: ${channel} ${message}`);
	}

	handleError(error) {
		Log.error(`Error ${error}`);
	}

	subscribeToChannels(channels) {
		Object.values(channels).forEach((channel) => {
			this.subscriber.subscribe(channel);
		});
	}

	publish({ channel, message }) {
		this.publisher.publish(channel, message);
    }
    
	subscribe(channel) {
		this.subscriber.subscribe(channel);
	}
}

module.exports = PubSub;

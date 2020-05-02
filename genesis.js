// Constants
const ENVIRONMENT = require('./lib/constants/environment');
const MESSAGE = require('./lib/constants/message');

// Redis
const redis = require('redis');
const Log = require('./lib/logger');

// Youtube Suggestion
const suggest = require('suggestion');

class Genesis {
	constructor() {
		this.id = 'genesis';

        // Connect to HIVE
		this.publisher = redis.createClient();
		this.subscriber = redis.createClient();
		this.publisher.on('error', (error) => this.handleError(error));
		this.subscriber.on('message', (channel, message) => this.handleMessage(channel, message));
        this.subscriber.on('error', (error) => this.handleError(error));

	}

	// Connect to Hive
	create() {
        Log.info(`borg.os.hive.connect`);

        const keyword = 'human';
        
        suggest(keyword, { client: 'youtube' }, (err, suggestions) => {
            if (err) throw err;
            // console.log(suggestions);

            const message = {
                header: {
                    borgID: this.id,
                    status: MESSAGE.STATUS.ONLINE,
                    type: MESSAGE.TYPE.SEARCH,
                },
                body: suggestions
            };

            console.log(message);
    
            this.publish(ENVIRONMENT.CHANNEL.HIVE, JSON.stringify(message));

        });

	}

	handleMessage(channel, message) {
        Log.info(`borg.os.hive.handle.message ${channel} ${message}`);
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

const genesis = new Genesis();

genesis.create();


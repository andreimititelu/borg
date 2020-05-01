const Log = require('./lib/logger');
const PubSub = require('./lib/pubsub');
const ENVIRONMENT = require('./lib/constants/environment');

Log.info(`Datasphere Node is Live!`);


/* 
const request = require('request');

const ROOT_NODE_ADDRESS = `http://localhost:3001`;
*/

const testPubSub = new PubSub();

testPubSub.subscriber.subscribe(ENVIRONMENT.CHANNELS.TEST);

const testMsg = {
    test : 'foo',
    'yet-another-test' : 'foo'
}

setTimeout(() => testPubSub.publisher.publish(ENVIRONMENT.CHANNELS.TEST, JSON.stringify(testMsg)), 1000);
/* Simplified stock exchange made with uWebSockets.js pub/sub */
const { createApp, getConnection, setTransactionsNumber, getTransactionsNumber } = require('./uws/app_factory');
const publisherFactory = require('./redis/publisher_factory')
const subscriberFactory = require('./redis/subscriber_factory');

let shares = {
	'NFLX': 280.48,
	'TSLA': 244.74,
	'AMZN': 1720.26,
	'GOOG': 1208.67,
	'NVDA': 183.03
};

const redis_info = {
	socket: {
		host: 'redis',
		port: 6379
	}
};

const publisher = publisherFactory.createPublisher(redis_info);

const app = createApp(3000, publisher, shares)

const subscriber = subscriberFactory.createSubscriber(redis_info, app)

/* Print transactions per second */
let last = Date.now();
setInterval(() => {
	time = ((Date.now() - last) * 0.001)
	transactionsPerSecond = getTransactionsNumber() / time

	console.log('connection: ' + getConnection())
	console.log("Transactions per second: " + transactionsPerSecond + ", time: " + time + ",here are the curret shares:");
	console.log(shares);
	console.log("");
	setTransactionsNumber(0);
	last = Date.now();
}, 1000);

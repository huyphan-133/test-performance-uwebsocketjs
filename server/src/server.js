/* Simplified stock exchange made with uWebSockets.js pub/sub */
const { createApp, getConnection, setTransactionsNumber, getTransactionsNumber } = require('./uws/app_factory');
const publisherFactory = require('./redis/publisher_factory');
const subscriberFactory = require('./redis/subscriber_factory');
const stockSubscriberFactory  = require('./amqp/stock_subscriber_factory');
const { initialProtoRoot } = require('./amqp/protobuf_parser');

(async()=>{
	await initialProtoRoot();

	const redis_info = {
		socket: {
			host: 'localhost',
			port: 6379
		}
	};
	
	const publisher = publisherFactory.createPublisher(redis_info);
	
	const app = createApp(3000)
	
	const subscriber = subscriberFactory.createSubscriber(redis_info, app)
	
	stockSubscriberFactory.createStockSubscriber('adapter_ex.datafeed', publisher)
	
	// createStockSubscriber('adapter_ex.datafeed')
	
	/* Print transactions per second */
	// let last = Date.now();
	// setInterval(() => {
	// 	time = ((Date.now() - last) * 0.001)
	// 	transactionsPerSecond = getTransactionsNumber() / time
	
	// 	console.log('connection: ' + getConnection())
	// 	console.log("Transactions per second: " + transactionsPerSecond + ", time: " + time + ",here are the curret shares:");
	// 	console.log(shares);
	// 	console.log("");
	// 	setTransactionsNumber(0);
	// 	last = Date.now();
	// }, 1000);
})()


const redis = require('redis');

function createPublisher(redis_info) {
    const publisher = redis.createClient(redis_info);
    publisher.connect();
    return publisher;
}

module.exports={createPublisher}
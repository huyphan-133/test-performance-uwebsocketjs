const redis = require('redis');

function createSubscriber(redis_info, app) {
    const subscriber = redis.createClient(redis_info);
    subscriber.connect();
    subscriber.subscribe('message', sData => {
        let data = JSON.parse(sData)
        app.publish(data.room, data.message);
    })
    return subscriber;
}

module.exports = {createSubscriber}
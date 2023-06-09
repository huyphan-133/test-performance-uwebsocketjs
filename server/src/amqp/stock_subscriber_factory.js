const amqp = require("amqplib");
const { convertBase64ToObject } = require("./protobuf_parser");

function createStockSubscriber(queueName) {
    (async () => {
        try {
            const connection = await amqp.connect("amqp://kbsv_notification:_Qdp!LcV6AUKsNfhRQWoPYEvnrA.vJWX@10.100.30.100:5672");
            const channel = await connection.createChannel();

            process.once("SIGINT", async () => {
                await channel.close();
                await connection.close();
            });

            await channel.assertQueue(queueName, { durable: true });
            await channel.consume(
                queueName,
                message => {
                    if (message !== null) {
                        let __msg = message.content.toString()
                        console.log("\n=======================================================")
                        console.log(__msg);
                        msgObj = convertBase64ToObject(__msg)
                        console.log()
                        console.log("=======================================================")
                        channel.ack(message);
                    } else {
                        console.log('Consumer cancelled by server');
                    }
                }
            );

            console.log(" [*] Waiting for messages. To exit press CTRL+C");
        } catch (err) {
            console.warn(err);
        }
    })();
}

module.exports = { createStockSubscriber }
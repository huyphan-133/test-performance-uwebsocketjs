const amqp = require("amqplib");
const { convertBase64ToObject } = require("./protobuf_parser");
const { handleStockInforObj } = require("../service/stock_message_handle");

function createStockSubscriber(queueName, publisher) {
    (async () => {
        try {
            const connection = await amqp.connect("amqp://kbsv_notification:_Qdp!LcV6AUKsNfhRQWoPYEvnrA.vJWX@10.100.30.100:5672");
            const channel = await connection.createChannel();

            process.once("SIGINT", async () => {
                await channel.close();
                await connection.close();
            });

            i = 0;
            await channel.consume(
                queueName,
                message => {
                    if (message !== null) {
                        let __msg = message.content.toString()
                        msgObj = convertBase64ToObject(__msg)
                        //update later type
                        if (msgObj.type == 'OddLotStockInfor') {
                            handleStockInforObj(msgObj.message, publisher)
                        }
                        channel.ack(message);
                    } else {
                        console.log('Consumer cancelled by server');
                    }
                },
                // { noAck: true }
            );
        } catch (err) {
            console.warn(err);
        }
    })();
}

module.exports = { createStockSubscriber }
var protobuf = require("protobufjs");
var path = require('path');

var protoRoot = {};
var protoMapping = [
    'StockInfor',
    'MarketInfor',
    'TransLog',
    'PutThroughInfo',
    'PTMatch',
    'IDXInfor',
    'CSIDXInfor',
    'TopNPrice',
    "OddLotStockInfor",
    "OddLotTransLog",
    "OddLotTopNPrice",
];

async function initialProtoRoot() {
    for (let i = 0; i < protoMapping.length; i++) {
        try {
            tag_classname = protoMapping[i]
            var protoFilePath = path.join(
                __dirname,
                'proto-files',
                tag_classname + '.proto'
            );
            var rootLoaded = await protobuf.load(protoFilePath);
            protoRoot[tag_classname] = rootLoaded;
        } catch (error) {
            console.log(tag_classname, 'initProtobufRoot: Exception', error);
        }
    }
}

function convertBase64ToObject(base64Message) {
    try {
        var byteArray = Buffer.from(base64Message, 'base64');
        var chunk = byteArray.slice(0, 4);
        var header = byteArrayToLong(chunk);
        var root = protoRoot[protoMapping[header]];
        if (!root) return null;
        // Obtain a message type
        var messageSchema = root.lookup(protoMapping[header]);

        // Decode an Uint8Array (browser) or Buffer (node) to a message
        var buffer = byteArray.slice(8);
        var message = messageSchema.decode(buffer);
        return { type: messageSchema.name, message }
    } catch (error) {
        console.error(error);
    }
}

function byteArrayToLong(byteArray) {
    var value = 0;
    for (var i = byteArray.length - 1; i >= 0; i--) {
        value = (value * 256) + byteArray[i];
    }
    return value;
};

module.exports = { convertBase64ToObject, initialProtoRoot }
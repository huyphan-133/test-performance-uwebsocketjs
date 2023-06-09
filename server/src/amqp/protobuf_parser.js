var protobuf = require("protobufjs");

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
            var rootLoaded = await protobuf.load('./proto-files/' + protoMapping[i] + '.proto');
            protoRoot[protoMapping[i]] = rootLoaded;
        } catch (error) {
            console.log(TAG_CLASSNAME, 'initProtobufRoot: Exception', error);
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
        var MessageSchema = root.lookup(protoMapping[header]);

        // Decode an Uint8Array (browser) or Buffer (node) to a message
        var buffer = byteArray.slice(8);
        var message = MessageSchema.decode(buffer);
        return message
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
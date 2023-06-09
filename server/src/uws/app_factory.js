// npm install uNetworking/uWebSockets.js#v16.2.0
const uWS = require('uWebSockets.js');

// uWebSockets.js is binary by default
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

/* Amount of client connect to server */
let connection = 0;

/* We measure transactions per second server side */
let transactionsNumber = 0;

function createApp(port) {
    const app = uWS.App().ws('/*', {
        open: () => {
            /* For now we only have one canvas */
            connection++
        },
        close: () => {
            connection--
        },
        message: (ws, message, isBinary) => {
            /* Parse JSON and perform the action */
            let json = JSON.parse(decoder.write(Buffer.from(message)));
            switch (json.action) {
                case 'sub': {
                    /* Subscribe to the share's value stream */
                    ws.subscribe('shares/' + json.share + '/value');
                    break;
                }
            }
        }
    }).listen(port, (listenSocket) => {
        if (listenSocket) {
            console.log(`Listening to port ${port}`);
        }
    });

    return app;
}

function getConnection() {
    return connection;
}

function setTransactionsNumber(_transactionsNumber) {
    transactionsNumber = _transactionsNumber
}

function getTransactionsNumber() {
    return transactionsNumber
}

module.exports = {
    createApp,
    getConnection,
    setTransactionsNumber,
    getTransactionsNumber
}
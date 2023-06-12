# Test performance uwebsocketjs server
Test performance of uwebsocketjs server. We have 400 stocks, and each stock will be 1 socket room.

Server: Server subscribes to rabbitmq server to get stock data. Each message is data of a stock. After receive message, server will send that data to corresponding room.

Client: Run client.js will make 500 connections (as client) by default to server, and each client will subscribe to random 30/400 stock codes (And each stock is 1 room, etc: shares/fpt/value).

## Run x nodes of server
```
docker compose up
```
By default, server runs with 2 instances. You can config more or less by:
- config upstream websocket in ./nginx/conf/default.conf
- config docker-compose.yml, add more node of server:
```
node3:
    build: ./server
    depends_on:
      - redis
      - nginx
node4:
    build: ./server
    depends_on:
      - redis
      - nginx
...
```
## Run client
```
cd client
npm install
node client
```
By default it will make 500 connections, each connections subscribe to 30 random stocks. To modify this, you can add params to commands:
Params:
- NUM_CLIENT: Number of connections to server
- SHARES_PER_CLIENT: Amount of subscribed shares per each connection
For instance, run 1000 connections, 50 random subscribed stocks per each connection. Run command below in git bash (for windows) or linux terminal:
```
NUM_CLIENT=1000 SHARES_PER_CLIENT=50 node client
```



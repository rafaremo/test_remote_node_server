const express = require('express');
const server = require('http').createServer();
const app = express();

app.get("/", function(req, res) {
  res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);
server.listen(3000, function () { console.log('Listening on 3000') });

/* WebSocket Server */
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ server: server });

wss.on('connection', function connection(ws) {
  const numClients = wss.clients.size;
  console.log('Client connected. Total clients: ' + numClients);

  wss.broadcast('A new client has joined the chat. Total clients: ' + numClients);

  if(ws.readyState === ws.OPEN ){
    ws.send('Welcome to my chat!');
  }

  ws.on('close', function close(){
    console.log('Client disconnected. Total clients: ' + wss.clients.size);
    wss.broadcast('A client has left the chat. Total clients: ' + wss.clients.size);
  })
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === client.OPEN) {
      client.send(data);
    }
  });
}

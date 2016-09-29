'use strict';

var express = require('express');
var socketIO = require('socket.io');
var path = require('path');

var PORT = process.env.PORT || 3000;
var INDEX = path.join(__dirname, 'index.html');

var server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

var socketServer = socketIO(server);

socketServer.on('connection', (socket) => {
  console.log('Client connected');
  var connectionTime = new Date().toTimeString();

  // server emmits the time of connection to client
  socketServer.sockets.emit('connectionTime', connectionTime);

  // when server receives event 'postingToServer' emitted by the client
  socket.on('postingToServer', function (clientData) {
    var serverTime = new Date().toTimeString();
    var serverMessage;

    if (clientData.userMessage) {
      serverMessage = 'Here is your final answer: ' + clientData.userMessage + '<br>You completed this program at: ' + serverTime;
    } else {
      serverMessage = 'You didn\'t send an answer therefore your grade is automatically a 0 :( <br> You completed this program at: ' + serverTime;
    }
    // server emmits the time sent from client and the current time on the server
    socketServer.sockets.emit('postingToClient', {clientTime: clientData.clientTime, serverMessage: serverMessage, serverTime: serverTime});
  });

  socket.on('disconnect', () => console.log('Client disconnected'));
});


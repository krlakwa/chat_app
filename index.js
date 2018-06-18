const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    //listening for connection of new user
});

server.listen(3000, function(){
    console.log('listening on *:3000');
});

app.use(function(req, res, next){
    res.status(404).send('Error 404. Sorry, this site does not exist');
});
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const UsersService = require('./UsersService');

const userService = new UsersService();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    //listening for connection of new user
    socket.on('join', function(name){
        userService.addUser({
            id: socket.id,
            name
        });
        io.emit('update', {
            users: userService.getAllUsers()
        });
    });
});

io.on('connection', function(socket){
    socket.on('disconnect', () => {
        userService.removeUser(socket.id);
        socket.broadcast.emit('update', {
            users: userService.getAllUsers()
        });
    });
});

io.on('connection', function(socket){
    socket.on('message', function(message){
        const {name} = userService.getUserByID(socket.id);
        socket.broadcast.emit('message', {
            text: message.text,
            from: name
        });
    })
});

server.listen(3000, function(){
    console.log('listening on *:3000');
});

app.use(function(req, res, next){
    res.status(404).send('Error 404. Sorry, this site does not exist');
});
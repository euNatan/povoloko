// Setup basic express server

//var io = require('socket.io').listen(3000);
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//var redis = require("redis"),
 // $redis = redis.createClient();
  //$redis.auth(14120114)
//load modules
//var MySQLPool = require("mysql-pool").MySQLPool;
//mysql connection
//var pool = new MySQLPool({
// poolSize: 1,
// user:     'root',
//  password: '14120114',
//  database: 'povoloko_development',
//  host: 'localhost'

//});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});
// usernames which are currently connected to the chat
var usernames = {};
var users = [];
var lastsendmessage = [];
var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    lastsendmessage.push(socket.username);
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data,
      lastsendmessage: lastsendmessage
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (data) {
    // we store the username in the socket session for this client
    socket.username = data["username"];
    socket.userid = data["id"];
    // add the client's username to the global list
    usernames[data["username"]] = data["username"];

    users.push(data);
  
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers,
      username: data["username"]
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
    
    io.emit('users online', {
      users: users 
    });

  });
  
  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.userid];

      for (var n = 0 ; n < users.length ; n++) {
          if (users[n].id == socket.userid) {
            users.splice(n,1);
          }
      }
      io.emit('users online', {
        users: users 
      });

      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
  
});

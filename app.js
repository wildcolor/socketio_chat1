var app = require('express')(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	users = [];

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
	// res.send('<h1>helllo world</h1>');
});


io.on('connection', function(socket){
	socket.broadcast.emit('new user connected',socket.id);
	console.log('a user connected: '+socket.id);

	socket.on('submit nickname', function(name, callback){
		console.log("user's nickname is : "+name);
		if(users.indexOf(name) == -1)
		{
			//callback(true);
			users.push(name);
			io.emit('user logged in',name);
			socket.username = name;
			console.log('user ' + name+ ' logged in');
		}
		else
		{
			//callback(false);
			io.emit('username already in use');
			console.log('username ' + name+ ' is already in use');
		}

	});

	socket.on('disconnect',function(){
		console.log('user disconnected: '+socket.id);
	});

	socket.on('chat message',function(data){
		console.log('server received a message from client: '+ data);
		io.emit('chat message', {msg:data,username:socket.username});
	})

});

http.listen(3000,function(){
	console.log('listening on *:3000');
});
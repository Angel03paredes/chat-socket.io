const express = require("express");
const path = require("path");
const morgan = require("morgan");
const SocketIO = require('socket.io');


const app = express();
app.set('port', process.env.PORT || 3000);



app.use(express.static(path.join(__dirname,'public')));

app.get('/',function(){
app.render("public/index.html");
});

const server = app.listen(app.get('port'));

const io = SocketIO("ws://chat-socket-io-simple.herokuapp.com:3000");

io.on('connection',(socket)=>{
    console.log("new connection",socket.id);
    socket.on('chat:message',(data) => {
        io.sockets.emit('chat:message',data);
    });

    socket.on("chat:typing",(data)=>{
        socket.broadcast.emit('chat:typing',data);
    })

    socket.on("chat:typing_out",(data)=>{
        socket.broadcast.emit('chat:typing_out',data);
    })
});

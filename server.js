const https = require('https');
const fs = require('fs');
const socketIo = require('socket.io');
const express = require('express');

const user_count = 3;

const app = express();
app.use(express.static('./static'));

app.get('/', (req, res) => {
    res.location('/index.html')
})

const options = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt')
}

const https_server = https.createServer(options, app);
const io = socketIo(https_server);

io.on("connection", (socket) => {
    console.log(`客户端 ${socket.id} 已连接`);

    socket.on("offer", (offer) => {
        console.log(`客户端 ${socket.id} 发送了 Offer`);
        socket.broadcast.emit("offer", offer);
    });

    socket.on("answer", (answer) => {
        console.log(`客户端 ${socket.id} 发送了 Answer`);
        socket.broadcast.emit("answer", answer);
    });

    socket.on("candidate", (candidate) => {
        console.log(`客户端 ${socket.id} 发送了 ICE candidate`);
        socket.broadcast.emit("candidate", candidate);
    });

    socket.on("hangup", () => {
        console.log(`客户端 ${socket.id} 发送了 Hangup`);
        socket.broadcast.emit("hangup");
    });

    socket.on("disconnect", () => {
        console.log(`客户端 ${socket.id} 断开连接`);
    });
});

https_server.listen(3000, () => {
    console.log('Server started on port 3000');
});
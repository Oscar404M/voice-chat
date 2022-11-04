const app = require("express")();
const express = require("express");
const server = require("http").createServer(app);
const cors = require("cors");
const path = require("path");

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

app.use(express.static(path.join(__dirname + "/public")), cors());

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
	res.send('Running');
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.emit("connection-success", {
        status: 'connection-success',
        socketId: socket.id
    });

    socket.on("sdp_offer", data=> {
        // console.log(data)
        socket.broadcast.emit("send_sdp-offer", data)
    });

    socket.on("sdp_answer", data=> {
        // console.log(data)
        socket.broadcast.emit("send_sdp-answer", data)
    });

    socket.on("candidate", data => {
        console.log(data)
        socket.broadcast.emit("send_candidate", data)
    })

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
      });
});

server.listen(PORT, () => console.log(`SERVER RUNNING on port: ${PORT}`));

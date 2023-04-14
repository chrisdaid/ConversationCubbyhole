let express = require("express");
let bodyParser = require("body-parser");
let routes = require("./routes");
let http = require("http");
let app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", express.static("./public"));
app.use(routes);

// global variables
let users = {};
let currentUsername;

let msgnum = 0;

/**
 * Create HTTP server.
 */
let server = http.createServer(app);
////////////////////////////////
// Socket.io server listens to our app
let io = require("socket.io").listen(server);

///////////////////////////////////
// Room Names in Socket.io
// Books -> booksRoom
// Entertainment -> entertainmentRoom
// Technology -> technologyRoom
// Health -> healthRoom
///////////////////////////////////

io.on("connection", function (socket) {
  console.log("User connected to server");
  console.log("Current name:", currentUsername);

  // keep track of currentUser's session ID
  const sessionID = socket.id;
  console.log(sessionID);

  let curRoom = "";

  // create user and append username to the array
  socket.on("createUser", function (username) {
    socket.username = username;
    let userID = "";

    users[sessionID] = username;
    console.log(users);

    users[userID] = username;
    console.log(`User ${username} has been created! [user id: ${userID}]`);

    // after user is created, automatically set the curRoom to "globalRoom"
    curRoom = "globalRoom";
    socket.currentRoom = "globalRoom";
  });

  // send a message when leaving a channel

  function sendLeaveMessage() {
    io.sockets.in(socket.currentRoom).emit("disconnectFromRoom", {
      serverSessionID: sessionID,
      username: users[sessionID],
      message: `<b>left</b> the ${socket.currentRoom}.`,
    });
  }

  // send a message upon joining
  function sendJoinMessage() {
    io.sockets.in(socket.currentRoom).emit("connectToRoom", {
      serverSessionID: sessionID,
      username: users[sessionID],
      message: `<b>joined</b> the ${socket.currentRoom}.`,
    });
  }

  // join room according to what user clicks
  socket.on("joinRoom", function (room) {
    // first leave current room
    // send a leave message to current room
    if (curRoom != room) {
      // setTimeout(sendLeaveMessage, 10);
      sendLeaveMessage();
    }

    socket.leave(curRoom);

    // join new room
    socket.join(room);
    curRoom = room;
    socket.currentRoom = room;

    console.log("THE CURRENT ROOM IS :", curRoom);
    console.log(`${socket.username} joined room: ${socket.currentRoom}`);

    // send a join message to everyone
    setTimeout(sendJoinMessage, 50);
  });

  // leaveRoom (only meant for going home)
  socket.on("leaveRoom", function (room) {
    // first leave current room
    // send a leave message to current room
    sendLeaveMessage();

    if (room != "globalRoom") {
      socket.leave(curRoom);
    }
    // join global
    curRoom = "globalRoom";
    socket.currentRoom = "globalRoom";

    console.log("THE CURRENT ROOM IS :", curRoom);
    console.log(`${socket.username} joined room: ${socket.currentRoom}`);

    // send a join message to everyone
    setTimeout(sendJoinMessage, 50);
  });

  // message in whichever room it was sent in
  socket.on("message", function (data) {
    // Broadcast to everyone (including self)
    io.sockets.to(socket.currentRoom).emit("message", users[sessionID], data);
    msgnum++;
  });

  // process image
  socket.on("image", function (msg) {
    io.sockets.to(socket.currentRoom).emit("image", msg);
  });
});

/**
 * Listen on provided port, on all network interfaces.
 */
let port = process.env.PORT || 3001;

server.listen(port);

console.log("STARTED SERVER ON PORT 3001");

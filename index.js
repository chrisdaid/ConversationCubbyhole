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
let users = [];
let currentUsername;

routes.get("/books", (req, res) => {
  res.sendFile(__dirname + "/public/views/books.html");
});

routes.get("/entertainment", (req, res) => {
  res.sendFile(__dirname + "/public/views/entertainment.html");
});

routes.get("/technology", (req, res) => {
  res.sendFile(__dirname + "/public/views/technology.html");
});

routes.get("/health", (req, res) => {
  res.sendFile(__dirname + "/public/views/health.html");
});

routes.post("/jquery/submitData", (req, res) => {
  console.log("NAME IS", req.body.name);
  currentUsername = req.body.name;
});

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

  // create user and append username to the array
  socket.on("createUser", function (username) {
    socket.username = username;
    users.push(username);
    console.log(`User ${username} has been created`);
  });

  // join room according to what user clicks
  let curRoom = "";
  socket.on("joinRoom", function (room) {
    socket.join(room);
    curRoom = room;
    socket.currentRoom = room;
    console.log("THE CURRENT ROOM IS :", curRoom);
    console.log(`${socket.username} joined room: ${socket.currentRoom}`);
  });

  // send a message upon joining
  function sendJoinMessage() {
    io.sockets.in(socket.currentRoom).emit("connectToRoom", {
      serverSessionID: sessionID,
      username: currentUsername,
      message: `joined the ${socket.currentRoom} room.`,
    });
  }
  // socket.on runs before io.sockets.in.emit, so delay it by 50ms
  setTimeout(sendJoinMessage, 50);

  // message in whichever room it was sent in
  socket.on("message", function (data) {
    // Broadcast to everyone (including self)
    io.sockets.to(socket.currentRoom).emit("message", currentUsername, data);
    msgnum++;
  });
});

/**
 * Listen on provided port, on all network interfaces.
 */
let port = process.env.PORT || 3000;

server.listen(port);

console.log("STARTED SERVER ON PORT 3000");

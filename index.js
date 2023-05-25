var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var express = require("express");
var flash = require("connect-flash");
var mongoose = require("mongoose");
var passport = require("passport");
var path = require("path");
var session = require("express-session");

var setUpPassport = require("./setuppassport");
var routes = require("./routes");
var routesData = require("./routesData");
var router = express.Router();

var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

//27017 seems to be the port number used by mongod
//mongoose.connect("mongodb://localhost:27017/userdb");
mongoose.connect("mongodb://127.0.0.1:27017/group123");
setUpPassport();

app.set("port", process.env.PORT || 3001);

app.use("/js", express.static("./public/js"));

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    secret: "LUp$Dg?,I#i&owP3=9su+OB%`JgL4muLF5YJ~{;t",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);
app.use(routesData);
// sockets code

// global variables
let users = {};

io.on("connection", function (socket) {
  console.log("User connected to server");
  router.get("/read", function (req, res) {
    if (!req.isAuthenticated()) {
      console.log("req is not Authenticated");
      res.json({ error: true });
      return;
    }

    //changed code.
    console.log("HELLO", db.getData(req.user.username));
  });

  // keep track of currentUser's session ID
  const sessionID = socket.id;
  console.log(sessionID);

  // keep track of currentUser's ID
  let userID;
  let curRoom = "";

  // Change USERNAME to the mongodb name
  // change userID to the actual mongodb ID

  // create user and append username to the array
  // createUser passed in an object with two properties: username, and id
  socket.on("createUser", function (obj) {
    socket.username = obj.username;
    userID = obj.id;

    // users[userID] = socket.username;

    users[userID] = socket.username;
    console.log(users);
    console.log(
      `User ${socket.username} has been created! [user id: ${userID}]`
    );

    // after user is created, automatically set the curRoom to "globalRoom"
    curRoom = "globalRoom";
    socket.currentRoom = "globalRoom";
  });

  // send a message when leaving a channel

  function sendLeaveMessage() {
    io.sockets.in(socket.currentRoom).emit("disconnectFromRoom", {
      serverUserID: userID,
      username: users[userID],
      message: `<b>left</b> the ${socket.currentRoom}.`,
    });
  }

  // send a message upon joining
  function sendJoinMessage() {
    io.sockets.in(socket.currentRoom).emit("connectToRoom", {
      serverUserID: userID,
      username: users[userID],
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
  socket.on("leaveRoom", function (fromRoom) {
    // first leave current room
    // send a leave message to current room
    sendLeaveMessage();

    socket.leave(curRoom);

    // join global
    curRoom = "globalRoom";
    socket.currentRoom = "globalRoom";

    console.log("THE CURRENT ROOM IS :", curRoom);
    console.log(`${socket.username} joined room: ${socket.currentRoom}`);

    // send a join message to everyone
    if (fromRoom != "globalRoom") {
      setTimeout(sendJoinMessage, 50);
    }
  });

  // message in whichever room it was sent in
  socket.on("message", function (data) {
    // Broadcast to everyone (including self)
    io.sockets.to(socket.currentRoom).emit("message", users[userID], data);
    // msgnum++;
  });

  // process image
  socket.on("image", function (msg) {
    io.sockets.to(socket.currentRoom).emit("image", msg);
  });
});
// END SOCKETS CODE
// set port code
var server = http.listen(3001, () => {
  console.log("Server staarted on port " + app.get("port"));
});
// app.listen(app.get("port"), function () {
// console.log("Server started on port " + app.get("port"));
// });

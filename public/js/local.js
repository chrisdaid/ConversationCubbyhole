// socket code, setting username
let socket = io();
// run function when setUsername btn is clicked
$("#setUsernameBtn").on("click", () => {
  let myUsername = $("#username").val();
  console.log(myUsername);
  socket.emit("createUser", myUsername);
});

// NOTES
// MAKE SURE TO LEAVE PREVIOUS ROOM AFTER JOINING A NEW ONE

let clientSessionID = "";
let isMessageSentByCurrentUser = false;
let currentRoomName = "globalRoom";
let placeholderMessageTemplate = "Send a message in ";

// initially join global channel when button is clicked

// join room function
function joinRoom(room) {
  if (room != currentRoomName) {
    currentRoomName = room;
    console.log(`JOINING ${room}`);
    socket.emit("joinRoom", room);

    // change message box placeholder to reflect current room
    $("#comment").attr(
      "placeholder",
      placeholderMessageTemplate + currentRoomName
    );
  }
}

// set clientSessionID once client is connected
socket.on("connect", () => {
  clientSessionID = socket.id;
});

//Get message from server.
socket.on("message", function (username, data) {
  console.log("commented " + data);
  let comment = data.comment;
  let messageSentFrom = username ? username : "Anonymous";
  // display message preventing XSS scripting
  var li = $("<div />", { text: ": " + comment });
  var al = $("<span />", { text: messageSentFrom });
  li.prepend(al);
  $("#messages").append(li);
});

socket.on("disconnectFromRoom", function (data) {
  // only send to the channel, no need for the client who disconnects to have a message
  if (data.serverSessionID == clientSessionID) {
    $("#messages").text(message);
    $("#messages").append(`<li>You have ${data.message}</li>`);
  } else {
    $("#messages").append(`<li>${data.username} has ${data.message}</li>`);
  }
});

socket.on("connectToRoom", function (data) {
  // log out the client side session ID
  console.log(clientSessionID);
  // send different global messages depending on if the client is seeing it or others are seeing it
  if (data.serverSessionID == clientSessionID) {
    $("#messages").append("<li>You have " + data.message + "</li>");
  } else {
    $("#messages").append(`<li>${data.username} has ${data.message}</li>`);
  }
});

function Clicked() {
  socket.emit("message", {
    name: $("#name").val(),
    comment: $("#comment").val(),
    image: $("#imageUploader"),
    // FIX image path, for now we just have a image property
  });
  return false;
}

// welcome modal disappears once is clicked

// once user clicks set username, modal disappears + join global channel
$("#setUsernameBtn").on("click", () => {
  console.log("button clicked, modal should disappear");
  if ($("#username").val()) {
    $(".welcome-modal").css("display", "none");

    // join room global
    socket.emit("joinRoom", currentRoomName);
    // change message box placeholder to reflect current room
    $("#comment").attr(
      "placeholder",
      placeholderMessageTemplate + currentRoomName
    );
  }
});

//added
socket.on("image", function (info) {
  if (info.buffer) {
    $("#messages").append(
      $("<li>").append($("<img>").attr("src", info.buffer))
    );
  }
});

var uploadFile = function () {
  var file = $("input[type=file]")[0].files[0];
  $("input[type=file]").val("");
  if (file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (event) {
      socket.emit("image", { image: true, buffer: event.target.result });
    };
    reader.onerror = function (event) {
      console.log("Error reading file: ", event);
    };
  }
};

$(document).ready(function () {
  console.log("ready");
  $("#comment").keydown(function (event) {
    if (event.which === 13) {
      Clicked();
      $("#comment").val("");
      event.preventDefault();
      return false;
    }
  });

  //added
  $("#image").keydown(function (event) {
    if (event.which === 13) {
      if ($("input[type=file]")[0].files[0]) {
        uploadFile();
      }
      return false;
    }
  });
});

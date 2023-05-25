// socket code, setting username
console.log("HE");
let socket = io();

// input textbox setUsername is selected -> enter key pressed, clicks the button automatically
// Get the input field
const setUsernameBox = document.getElementById("username");

// scroll to bottom function
function scrollToBottom() {
  $(".message-container").scrollTop($(".message-container")[0].scrollHeight);
  console.log("scrolled to bottom!");
}

// NOTES
// MAKE SURE TO LEAVE PREVIOUS ROOM AFTER JOINING A NEW ONE

let clientUserID = "";
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

// // set clientUserID once client is connected
// socket.on("connect", () => {
//   clientUserID = socket.id;
// });

//Get message from server.
socket.on("message", function (username, data) {
  socket.on("message", function (username, data) {
    console.log("commented " + data);

    let time = new Date();
    let timestring = time.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });
    console.log(timestring);
    let comment = data.comment;
    let messageSentFrom = username ? username : "Anonymous";
    let fullMessage = `${timestring} ${messageSentFrom}`;
    // display message preventing XSS scripting
    var li = $("<div />", { text: ": " + comment });
    var al = $("<span />", { text: fullMessage });
    li.prepend(al);
    $("#messages").append(li);

    setTimeout(scrollToBottom, 100);
    // scrollToBottom();
  });
});

socket.on("disconnectFromRoom", function (data) {
  // only send to the channel, no need for the client who disconnects to have a message
  if (data.serverUserID == clientUserID) {
    // clear chat besides the join and leave messages
    $("#messages").children().remove();

    // $("#messages").text(message);
    $("#messages").append(`<li>You have ${data.message}</li>`);
  } else {
    $("#messages").append(`<li>${data.username} has ${data.message}</li>`);
  }
  scrollToBottom();
});

socket.on("connectToRoom", function (data) {
  // log out the client side session ID
  console.log(clientUserID);
  // send different global messages depending on if the client is seeing it or others are seeing it
  if (data.serverUserID == clientUserID) {
    $("#messages").append("<li>You have " + data.message + "</li>");
  } else {
    $("#messages").append(`<li>${data.username} has ${data.message}</li>`);
  }
  scrollToBottom();
});

function Clicked() {
  socket.emit("message", {
    name: $("#name").val(),
    comment: $("#comment").val(),
    image: $("#imageUploader"),
  });
  return false;
}

// welcome modal disappears once is clicked

// once user clicks set username, modal disappears + join global channel
$("#setUsernameBtn").on("click", () => {
  console.log("button clicked, modal should disappear");
  let trimmedLength = $("#username").val().trim();
  if (trimmedLength.length > 0) {
    // hide modal
    $(".welcome-modal").css("display", "none");
    // hide the "join global to begin chatting" overlay
    $(".selector-messages-overlay").addClass("hidden");
    // join room global
    currentRoomName = "globalRoom";
    socket.emit("joinRoom", currentRoomName);
    // change message box placeholder to reflect current room
    $("#comment").attr(
      "placeholder",
      placeholderMessageTemplate + currentRoomName
    );
  }
});

function focusFileUpload() {
  $("#image").focus();
}

function goHome() {
  // clear username
  $("#username").val("");

  socket.emit("leaveRoom", currentRoomName);

  // hide the chat message box
  // $(".chat-container").addClass("hidden");

  // display the overlay covering the room selector
  // $(".selector-messages-overlay").removeClass("hidden");

  // $(".welcome-modal").css("display", "flex");
  // $(".chat-container").toggleClass("hidden");
}

// because of the custom upload image icon, we're using a label to display the icon and made the file uploader hidden
// must use this function to call the fileupload
$("#custom-upload").on("click", function () {
  $("#image").click();
  console.log("custom upload button clicked");
  focusFileUpload();
  return false;
});

//added
socket.on("image", function (info) {
  if (info.buffer) {
    $("#messages").append(
      $("<li>").append($("<img>").attr("src", info.buffer))
    );
    setTimeout(scrollToBottom, 100);
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
      if ($("input[type=file]")[0].files[0]) {
        uploadFile();
      }
      Clicked();
      $("#comment").val("");
      event.preventDefault(); // take out if bugs
      return false;
    }
  });

  //added
  $("#image").keydown(function (event) {
    if (event.which === 13) {
      if ($("input[type=file]")[0].files[0]) {
        uploadFile();
      }
      Clicked();
      $("#comment").val("");
      return false;
    }
  });
});

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

// join room function {OLD}
// function joinRoom(room) {
//   if (room != currentRoomName) {
//     currentRoomName = room;
//     console.log(`JOINING ${room}`);
//     socket.emit("joinRoom", room);

//     // change message box placeholder to reflect current room
//     $("#comment").attr(
//       "placeholder",
//       placeholderMessageTemplate + currentRoomName
//     );
//   }
// }

// new jasper code ------ {NEW}
//added/////////////////////////////////////////////////////////////////////////////////////////////////////
let numInBooks = 0;
let numInEnter = 0;
let numInTechn = 0;
let numInHealt = 0;

function getNumInBooks(operation) {
  $.ajax({
    url: "/books",
    type: "GET",
    data: { roomName: "booksRoom" },
    success: function (data) {
      console.log("getNumInBooks: " + data);
      numInBooks = Number(data);
      if (operation == "add") {
        numInBooks++;
      } else if (operation == "subtract") {
        numInBooks--;
      }
      if (operation == "add") {
        numInBooks--;
      } else if (operation == "subtract") {
        numInBooks++;
      }
      console.log("getrequest getNumInBooks: " + numInBooks);
    },
  });
}
function getNumInEnter(operation) {
  $.ajax({
    url: "/entertainment",
    type: "GET",
    data: { roomName: "entertainmentRoom" },
    success: function (data) {
      //console.log("getNumInEnter: " + data);
      numInEnter = Number(data);
      if (operation == "add") {
        numInEnter++;
      } else if (operation == "subtract") {
        numInEnter--;
      }
      if (operation == "add") {
        numInEnter--;
      } else if (operation == "subtract") {
        numInEnter++;
      }
      //console.log("getrequest getNumInEnter: " + numInEnter);
    },
  });
}
function getNumInTechn(operation) {
  $.ajax({
    url: "/technology",
    type: "GET",
    data: { roomName: "technologyRoom" },
    success: function (data) {
      //console.log("getNumInTechn: " + data);
      numInTechn = Number(data);
      if (operation == "add") {
        numInTechn++;
      } else if (operation == "subtract") {
        numInTechn--;
      }
      if (operation == "add") {
        numInEnter--;
      } else if (operation == "subtract") {
        numInEnter++;
      }
      //console.log("getrequest getNumInTechn: " + numInTechn);
    },
  });
}
function getNumInHealt(operation) {
  $.ajax({
    url: "/health",
    type: "GET",
    data: { roomName: "healthRoom" },
    success: function (data) {
      //console.log("getNumInHealt: " + data);
      numInHealt = Number(data);
      if (operation == "add") {
        numInHealt++;
      } else if (operation == "subtract") {
        numInHealt--;
      }
      if (operation == "add") {
        numInEnter--;
      } else if (operation == "subtract") {
        numInEnter++;
      }
      //console.log("getrequest getNumInHealt: " + numInHealt);
    },
  });
}

// join room function {NEW}
function joinRoom(room) {
  console.log("in local.js joinRoom");
  getNumInBooks("");
  getNumInEnter("");
  getNumInTechn("");
  getNumInHealt("");

  if (room == "booksRoom") {
    if (numInBooks == 5) {
      alert("Books is full");
      return;
    }

    if (currentRoomName == "entertainmentRoom") {
      getNumInEnter("subtract");
      //console.log("numInEnter: " + numInEnter);
    } else if (currentRoomName == "technologyRoom") {
      getNumInTechn("subtract");
      //console.log("numInTechn: " + numInTechn);
    } else if (currentRoomName == "healthRoom") {
      getNumInHealt("subtract");
      //console.log("numInHealt: " + numInHealt);
    }

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

    getNumInBooks("add");
    console.log("numInBooks: " + numInBooks);
  } else if (room == "entertainmentRoom") {
    if (numInEnter == 5) {
      alert("Entertainment is full");
      return;
    }

    if (currentRoomName == "booksRoom") {
      getNumInBooks("subtract");
      console.log("numInBooks: " + numInBooks);
    } else if (currentRoomName == "technologyRoom") {
      getNumInTechn("subtract");
      console.log("numInTechn: " + numInTechn);
    } else if (currentRoomName == "healthRoom") {
      getNumInHealt("subtract");
      console.log("numInHealt: " + numInHealt);
    }

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

    getNumInEnter("add");
    console.log("numInEnter: " + numInEnter);
  } else if (room == "technologyRoom") {
    if (numInTechn == 5) {
      alert("Technology is full");
      return;
    }

    if (currentRoomName == "booksRoom") {
      getNumInBooks("subtract");
      console.log("numInBooks: " + numInBooks);
    } else if (currentRoomName == "entertainmentRoom") {
      getNumInEnter("subtract");
      console.log("numInEnter: " + numInEnter);
    } else if (currentRoomName == "healthRoom") {
      getNumInHealt("subtract");
      console.log("numInHealt: " + numInHealt);
    }

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

    getNumInTechn("add");
    console.log("numInTechn: " + numInTechn);
  } else if (room == "healthRoom") {
    if (numInHealt == 5) {
      alert("Health is full");
      return;
    }

    if (currentRoomName == "booksRoom") {
      getNumInBooks("subtract");
      console.log("numInBooks: " + numInBooks);
    } else if (currentRoomName == "entertainmentRoom") {
      getNumInEnter("subtract");
      console.log("numInEnter: " + numInEnter);
    } else if (currentRoomName == "technologyRoom") {
      getNumInTechn("subtract");
      console.log("numInTechn: " + numInTechn);
    }

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

    getNumInHealt("add");
    console.log("numInHealt: " + numInHealt);
  } else if (room == "globalRoom") {
    if (currentRoomName == "booksRoom") {
      getNumInBooks("subtract");
      console.log("numInBooks: " + numInBooks);
    } else if (currentRoomName == "entertainmentRoom") {
      getNumInEnter("subtract");
      console.log("numInEnter: " + numInEnter);
    } else if (currentRoomName == "technologyRoom") {
      getNumInTechn("subtract");
      console.log("numInTechn: " + numInTechn);
    } else if (currentRoomName == "healthRoom") {
      getNumInHealt("subtract");
      console.log("numInHealt: " + numInHealt);
    }

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
  } else {
    if (currentRoomName == "booksRoom") {
      getNumInBooks("subtract");
      console.log("numInBooks: " + numInBooks);
    } else if (currentRoomName == "entertainmentRoom") {
      getNumInEnter("subtract");
      console.log("numInEnter: " + numInEnter);
    } else if (currentRoomName == "technologyRoom") {
      getNumInTechn("subtract");
      console.log("numInTechn: " + numInTechn);
    } else if (currentRoomName == "healthRoom") {
      getNumInHealt("subtract");
      console.log("numInHealt: " + numInHealt);
    }

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
}
// END JOIN ROOM FUNCTION {NEW}
// -=-=-=--=-=-=-=-=-=-=-=-=--=-=-
//Get message from server.
socket.on("message", function (username, data) {
  console.log("commented " + data);

  let messageSentFrom = username ? username : "Anonymous";

  let time = new Date();
  let timestring = time.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });

  let comment = `${timestring} ${data.comment}`;

  var li;

  if (
    comment.includes(".com") == true ||
    comment.includes(".org") == true ||
    comment.includes(".edu") == true ||
    comment.includes(".gov") == true ||
    comment.includes(".net") == true
  ) {
    if (
      comment.includes("http://") == true ||
      comment.includes("https://") == true
    ) {
      li = $(
        `<div>${timestring} <a href=${data.comment} target="_blank">${data.comment}</a></div>`
      );
    } else {
      var newComment = "http://" + data.comment;
      li = $(
        `<div>${timestring} <a href=${newComment} target="_blank">${newComment}</a></div>`
      );
    }
  } else {
    li = $("<div />", { text: comment });
  }

  // display message preventing XSS scripting
  var al = $("<span />", { text: messageSentFrom + ": " });

  li.prepend(al);
  $("#messages").append(li);

  setTimeout(scrollToBottom, 100);
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

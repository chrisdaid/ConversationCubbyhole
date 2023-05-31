function readClicked() {
  $.ajax({
    url: "/read",
    type: "GET",
    data: {},
    success: function (data) {
      if (data.error) alert("bad");
      else {
        console.log(data.ident + " " + data.gradeLevel + " " + data.canDrive);
        $("#identifier").val(data.ident);
        $("#gradeLevel").val(data.gradeLevel);
        // can drive do
        if (data.canDrive) {
          $("#canDrive").prop("checked", true);
        } else {
          $("#canDrive").prop("checked", false);
        }
      }
    },
    dataType: "json",
  });
  return false;
}

function updateClicked() {
  // display the modal
  $(".newUsername-modal-container").removeClass("hidden");
}

function changeUsername() {
  console.log("sorry changing usernames currently is broken");
  // $.ajax({
  //   url: "/update",
  //   type: "PUT",
  //   data: {
  //     ident: $("#identifier").val(),
  //     username: $("#newUsername").val(),
  //   },
  //   success: function (data) {
  //     if (data.error) alert("bad");
  //     else alert("good");
  //     closeModal();
  //   },
  //   dataType: "json",
  // });

  return false;
}

function closeModal() {
  $(".newUsername-modal-container").addClass("hidden");
}

function logoutClicked() {
  console.log("session logoutClicked");
  $.get("/logout", function (data) {
    console.log("session logout function callback");
    window.location = data.redirect;
  });
  return false;
}

// let socket = io();

$(document).ready(function () {
  console.log("session doc ready");
  $.get("/userInfo", function (data) {
    console.log("session get userInfo function callback");

    // set username in the profile dropdown
    // if (data.username) $(".profile-name").text(data.username);
    if (data.username) {
      $(".profile-name").text(data.username);
      $(".profile-name").prop("title", data.username);
      console.log(data.ident);
      // emit createUser passing the name from mongodb into index.js
      socket.emit("createUser", { username: data.username, id: data.ident });
      // join room global once session is loaded
      currentRoomName = "globalRoom";
      socket.emit("joinRoom", currentRoomName);
      // change message box placeholder to reflect current room
      $("#comment").attr(
        "placeholder",
        placeholderMessageTemplate + currentRoomName
      );
    }

    // set clientSessionID once client is connected
    // use the unique mongodb user ID
    // socket.on("connect", () => {
    //   clientSessionID = data.ident;
    // });

    $("#identifier").val(data.ident);
    $("#gradeLevel").val(data.gradeLevel);
    console.log(data.canDrive);
    if (data.canDrive) {
      $("#canDrive").prop("checked", true);
    } else {
      $("#canDrive").prop("checked", false);
    }
  });

  $("#readButton").click(readClicked);
  $("#change-username").click(updateClicked);
  $("#close-username-modal").click(closeModal);
  $("#setUsernameBtn").click(changeUsername);

  $("#logout").click(logoutClicked);
});

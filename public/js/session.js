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
  $.ajax({
    url: "/update",
    type: "PUT",
    data: {
      identifier: $("#identifier").val(),
      gradeLevel: $("#gradeLevel").val(),
      canDrive: $("#canDrive").is(":checked"),
    },
    success: function (data) {
      if (data.error) alert("bad");
      else alert("good");
    },
    dataType: "json",
  });
  return false;
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
  $("#updateButton").click(updateClicked);
  //  $("#deleteButton").click(deleteClicked);

  $("#logout").click(logoutClicked);
});

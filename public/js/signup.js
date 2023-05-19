function userClicked() {
  console.log("signup userClicked");

  $.post(
    "/signup",
    { username: $("#username").val(), password: $("#psw").val() },
    function (data) {
      console.log("signup callback function");
      //added to create infos document for regular user.
      if (data.redirect == "/session") {
        createClicked(data.ident);
        window.location = data.redirect;
      } else if (data.error == "takenUsername") {
        displayErrorMessage();
      }
      // window.location = data.redirect; // don't redirect if username is taken, or else it clears the error message
    }
  );

  return false;
}

function displayErrorMessage() {
  console.log("Username is taken: error.");
  $("#errorMessage").text("Username is taken.");
}

function createClicked(ident) {
  $.ajax({
    url: "/create",
    type: "POST",
    data: {
      identifier: ident,
      gradeLevel: 11,
      canDrive: false,
    },
    success: function (data) {
      if (!data) alert("bad create");
      else alert("good create");
    },
    dataType: "json",
  });
  return false;
}

$(document).ready(function () {
  $("#username").keydown(function (event) {
    if (event.which === 13) {
      userClicked();
      event.preventDefault();
      return false;
    }
  });

  $("#psw").keydown(function (event) {
    if (event.which === 13) {
      userClicked();
      event.preventDefault();
      return false;
    }
  });
});

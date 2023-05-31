function userClicked() {
  console.log("login userClicked");
  $.post(
    "/login",
    {
      username: $("#username").val().toLowerCase().trim(),
      password: $("#psw").val(),
    },
    function (data) {
      console.log("login callback function");
      console.log("login callback redirect: " + data.redirect);
      // if login is successful, display success message right before redirecting

      if (data.redirect == "/session") {
        $("#errorMessage").text("Login success, redirecting...");

        setTimeout(function () {
          window.location = data.redirect;
        }, 500); // 500ms delay
      } else {
        // else, display error message redirect instantly
        $("#errorMessage").text("Login failed, try again...");

        // window.location = data.redirect;
      }
    }
  );

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

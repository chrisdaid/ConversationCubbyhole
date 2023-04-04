// set username in localStorage
function setNameLocally() {
  let username = $("#username").val();
  if (username.length == 0) {
    // set error message to error
    $("#usernameError").text("Please enter a username.");
  } else {
    // change error text to success
    $("#usernameError").text(`Username is set to ${username}`);

    console.log("setting name in local storage...");
    window.localStorage.setItem("name", $("#username").val());
  }
}

$("#setUsernameBtn").click(setNameLocally);

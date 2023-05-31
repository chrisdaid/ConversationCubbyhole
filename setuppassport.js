var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require("./models/user");
let identA = 0;

module.exports = function () {
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use(
    "login",
    new LocalStrategy(function (username, password, done) {
      console.log("passport use login function callback");
      User.findOne({ username: username }, function (err, user) {
        console.log("User findOne function callback");
        if (err) {
          return done(err);
        }
        if (!user) {
          console.log("user doesn't exist -> line 24 setuppassport.js");
          return done(null, false, { message: "No user has that username!" });
        }

        console.log("yes user has that username");

        user.checkPassword(password, function (err, isMatch) {
          if (err) {
            return done(err);
          }
          if (isMatch) {
            console.log("yes there is a match");

            return done(null, user);
          } else {
            console.log("incorrect password -> line 42 setuppassport.js");
            return done(null, false, { message: "Invalid password." });
          }
        });
      });

      // User.findOneAndUpdate(
      //   { username: username },
      //   { ident: identA },
      //   function (error, oldData) {
      //     if (error) {
      //       console.log(
      //         "ERROR cannot find and update, line 52 setuppassport.js"
      //       );
      //     } else {
      //       User.find({}, function (err, user) {
      //         console.log(err);
      //         // for (let i = 0; i < user.length; i++) {
      //         console.log("PASSPORT-=-=-==-=-=-=-=-=- line 63");
      //         // console.log(user[i].ident);
      //         console.log("PASSPORT-=-=-==-=-=-=-=-=- line 65");
      //         // identA++;
      //         // incrementIndent();
      //         // }
      //       });
      //     }
      //   }
      // );
    })
  );
};

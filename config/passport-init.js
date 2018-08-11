const passport = require("passport");
const User = require("../models/User");

module.exports = () => {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    console.log("bleh");

    done(null, user);
    // User.findById(user.id, function(err, user) {
    //   done(err, user);
    // });
  });
};

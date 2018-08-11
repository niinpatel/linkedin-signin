const passport = require("passport");
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const init = require("./passport-init");
const User = require("../models/User");
const { linkedinKey, linkedinSecret } = require("./config");

const options = {
  clientID: linkedinKey,
  clientSecret: linkedinSecret,
  callbackURL: "http://127.0.0.1:5000/auth/linkedin/callback",
  scope: ["r_basicprofile"],
  state: true
};

const callback = (accessToken, refreshToken, profile, done) => {
  process.nextTick(async function() {
    let user = await User.findOneAndUpdate(
      { linkedinId: profile.id },
      profile,
      {
        new: true,
        upsert: true
      }
    );

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    return done(null, user);
  });
};

passport.use(new LinkedInStrategy(options, callback));

init();

module.exports = passport;

const passport = require("passport");
const LinkedInStrategy = require("passport-linkedin-token-oauth2").Strategy;
const User = require("../models/User");
const { linkedinKey, linkedinSecret } = require("./config");

const profileFields = [
  "id",
  "email-address",
  "formatted-name",
  "headline",
  "location",
  "summary",
  "public-profile-url"
];

const profileURL = `https://api.linkedin.com/v1/people/~:(${profileFields.join(
  ","
)})?format=json`;

const options = {
  clientID: linkedinKey,
  clientSecret: linkedinSecret,
  profileURL
};

const callback = async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOneAndUpdate(
      { linkedinId: profile.id },
      {
        name: profile.displayName,
        email: profile._json.emailAddress,
        headline: profile._json.headline,
        location: profile._json.location.name,
        summary: profile._json.summary,
        linkedinProfileURL: profile._json.publicProfileUrl
      },
      {
        new: true,
        upsert: true
      }
    );

    return done(null, user);
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: JSON.stringify(err) });
  }
};

passport.use(new LinkedInStrategy(options, callback));

module.exports = passport;

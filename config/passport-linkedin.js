const passport = require("passport");
const LinkedInStrategy = require("passport-linkedin-token-oauth2").Strategy;
const User = require("../models/User");
const { linkedinKey, linkedinSecret } = require("./config");

const profileURL =
  "https://api.linkedin.com/v1/people/~:(id,email-address,first-name,last-name,formatted-name,picture-url,headline,location,summary,positions,skills,date-of-birth)?format=json";

const options = {
  clientID: linkedinKey,
  clientSecret: linkedinSecret,
  profileURL
};

const callback = async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOneAndUpdate(
    { linkedinId: profile.id },
    {
      name: profile.displayName,
      email: profile._json.emailAddress,
      headline: profile._json.headline,
      location: profile._json.location.name,
      summary: profile._json.summary
    },
    {
      new: true,
      upsert: true
    }
  );

  return done(null, user);
};

passport.use(new LinkedInStrategy(options, callback));

module.exports = passport;

const express = require("express");
const passport = require("passport");
const { port } = require("./config/config");
const cors = require("cors");
const bodyParser = require("body-parser");
const expressJwt = require("express-jwt");
const User = require("./models/User");

// initialize express application
const app = express();

// connect to database
require("./dbconnect");

// cors
app.use(cors());

// use body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// passport config
require("./config/passport-linkedin");
app.use(passport.initialize());

// auth routes for linkedin
const authLinkedin = require("./routes/authLinkedin");
app.use("/auth/linkedin/", authLinkedin);

// get logged in user
app.get(
  "/get-logged-user",
  expressJwt({
    secret: "secret",
    requestProperty: "auth"
  }),
  async (req, res) => {
    let user = await User.findById(req.auth.id);
    res.json(user);
  }
);

// Serve static assets if in prod
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// start listening to requests on port
app.listen(port, err => {
  if (err) throw err;
  console.log(`Listening on port ${port}`);
});

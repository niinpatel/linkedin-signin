const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const { port, mongoUri } = require("./config/config");
const session = require("express-session");
const cors = require("cors");

// initialize express application
const app = express();

// connect to database
mongoose.connect(
  mongoUri,
  { useNewUrlParser: true },
  err => {
    if (err) throw err;
    console.log("Connected to Database");
  }
);

// session config
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);

// cors
app.use(cors());

// passport config
app.use(passport.initialize());
app.use(passport.session());
const passportLinkedIn = require("./config/passport-linkedin");

// linkedin auth config
app.get("/auth/linkedin", passportLinkedIn.authenticate("linkedin"));
app.get(
  "/auth/linkedin/callback",
  passportLinkedIn.authenticate("linkedin", { failureRedirect: "/fail" }),
  (req, res) => {
    res.json(req.user);
  }
);

app.get("/get-logged-user", (req, res) => {
  res.json(req.user);
});

// start listening to requests on port
app.listen(port, err => {
  if (err) throw err;
  console.log(`Listening on port ${port}`);
});

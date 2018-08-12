const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const {
  port,
  mongoUri,
  linkedinKey,
  linkedinSecret
} = require("./config/config");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const qs = require("qs");

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

// use body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// passport config
app.use(passport.initialize());
app.use(passport.session());

app.get("/get-logged-user", (req, res) => {
  res.json(req.user);
});

app.post("/get-linkedin-token", (req, res) => {
  const { code, redirectUri } = req.body;
  const requestOptions = {
    grant_type: "authorization_code",
    client_id: linkedinKey,
    client_secret: linkedinSecret,
    code,
    redirect_uri: redirectUri
  };

  axios
    .post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      qs.stringify(requestOptions)
    )
    .then(data => res.json(data.data))
    .catch(err => console.log("err", err));
});

app.post(
  "/auth/linkedin/token",
  passport.authenticate("linkedin-token"),
  (req, res) => {
    if (req.user) {
      console.log(req.user);
      return res.json(req.user);
    } else console.log("error");

    return res.status(401).json({ error: "no user found" });
  }
);

// start listening to requests on port
app.listen(port, err => {
  if (err) throw err;
  console.log(`Listening on port ${port}`);
});

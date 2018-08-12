const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const axios = require("axios");
const qs = require("qs");
const { linkedinKey, linkedinSecret } = require("../config/config");

// @path auth/linkedin/get-linkedin-token
// @desc get auth token from linkedin
router.post("/get-linkedin-token", (req, res) => {
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

// @path auth/linkedin/token
// @desc validate linkedin token
router.post(
  "/token",
  passport.authenticate("linkedin-token", { session: false }),
  (req, res) => {
    if (req.user) {
      let token = jwt.sign({ id: req.user.id }, "secret", {
        expiresIn: 60 * 120
      });

      return res.json({ user: req.user, jwt: token });
    } else console.log("error");

    return res.status(401).json({ error: "no user found" });
  }
);

module.exports = router;

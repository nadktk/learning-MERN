const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load User model
const User = require("../../models/User");

// @route   GET api/user/test
// @desc    Tests user route
// @access  Public
router.get("/test", (req, res) =>
  res.json({
    message: "User works!"
  })
);

// @route   POST api/user/register
// @desc    Register user route
// @access  Public
router.post("/register", (req, res) => {
  const { name, password, email } = req.body;

  // find user if exists and return 400 status
  User.findOne({ email }).then(user => {
    if (user) {
      return res.status(400).json({
        email: "email already exists"
      });
    } else {
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });
      const newUser = new User({
        name: name,
        email: email,
        avatar,
        password: password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   POST api/user/login
// @desc    Login user route / returning JWT token
// @access  Public
router.post("/login", (req, res) => {
  const { password, email } = req.body;

  // find user by email
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    }

    // check password
    bcrypt.compare(password, user.password).then(isMatch => {
      // password doesn't match
      if (!isMatch) {
        return res.status(400).json({
          password: "Wrong password"
        });
      }

      // password matches - success login
      // create JWT payload
      const payload = {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      };

      // sign token
      jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
        res.json({
          success: true,
          token: "Bearer " + token
        });
      });
    });
  });
});

// @route   GET api/user/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id, name, email } = req.user;
    res.json({ id, name, email });
  }
);

module.exports = router;

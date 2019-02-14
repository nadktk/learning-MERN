const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Input Validator
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

// load profile model
const Profile = require("../../models/Profile");
// load user profile
const User = require("../../models/User");

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get("/test", (req, res) =>
  res.json({
    message: "Profile works!"
  })
);

// @route   GET api/profile
// @desc    Current user profile route
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        // there is no profile
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }

        res.json(profile);
      })
      .catch(error => res.status(404).json(error));
  }
);

// @route   GET api/profile/all
// @desc    Get all users' profiles
// @access  Public
router.get("/all", (req, res) => {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      // there are no profiles
      if (!profiles || profiles.length === 0) {
        errors.noprofiles = "There are no users' profiles";
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(error =>
      res.status(404).json({ noprofiles: "There are no users' profiles" })
    );
});

// @route   GET api/profile/handle/:handle
// @desc    Get user's profile by handle
// @access  Public
router.get("/handle/:handle", (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      // there is no profile
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(error => res.status(404).json(error));
});

// @route   GET api/profile/user/:user_id
// @desc    Get user's profile by ID
// @access  Public
router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      // there is no profile
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(error =>
      res.status(404).json({ noprofile: "There is no profile for this user" })
    );
});

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    if (!isValid) {
      // return any errors with 400 status
      return res.status(400).json(errors);
    }

    // get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFieldy.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    // skills - plit in array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }

    // social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // update profile
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true, useFindAndModify: false }
        )
          .populate("user", ["name", "avatar"])
          .then(profile => res.json(profile));
      } else {
        // create profile

        // check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "This handle already exists";
            res.status(400).json(errors);
          }

          // save new profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      } = req.body;
      const { errors, isValid } = validateExperienceInput(req.body);

      if (!isValid) {
        return res.status(400).json(errors);
      }

      const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      };

      // add experience to array
      profile.experience.unshift(newExp);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // get remove index
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);

        // experience index not found
        if (removeIndex === -1) {
          return res
            .status(404)
            .json({ noexperience: "No experience with this ID found" });
        }

        // splice out of array
        profile.experience.splice(removeIndex, 1);

        // save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      } = req.body;
      const { errors, isValid } = validateEducationInput(req.body);

      if (!isValid) {
        return res.status(400).json(errors);
      }

      const newEducation = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      };

      // add education to array
      profile.education.unshift(newEducation);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // get remove index
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);

        // education index not found
        if (removeIndex === -1) {
          return res
            .status(404)
            .json({ noeducation: "No education with this ID found" });
        }

        // splice out of array
        profile.education.splice(removeIndex, 1);

        // save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;

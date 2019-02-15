const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Input Validator
const validatePostInput = require("../../validation/post");

// load post model
const Post = require("../../models/Post");
// load user profile
const Profile = require("../../models/Profile");

// @route   GET api/posts/test
// @desc    Tests posts route
// @access  Public
router.get("/test", (req, res) =>
  res.json({
    message: "Posts works!"
  })
);

// @route   POST api/posts
// @desc    Create post route
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const { text, name, avatar } = req.body;
    const newPost = new Post({ text, name, avatar, user: req.user.id });

    newPost.save().then(post => res.json(post));
  }
);

// @route   GET api/posts
// @desc    Get all post route
// @access  Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(error => res.status(404).json({ noposts: "No posts found" }));
});

// @route   GET api/posts/:id
// @desc    Get a post by ID route
// @access  Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(() => res.status(404).json({ nopost: "This post is not found" }));
});

// @route   DELETE api/posts/:id
// @desc    Delete a post by ID route
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // check the post owner
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ notauth: "User not authorized" });
        }

        // delete
        post
          .remove()
          .then(() => res.json({ message: "success, post deleted" }))
          .catch(err =>
            res.status(404).json({ nopost: "This post is not found" })
          );
      })
      .catch(err => res.status(404).json({ nopost: "This post is not found" }));
  }
);

// @route   POST api/posts/like/:id
// @desc    Like post route
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // if already liked
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User already liked this post" });
          }

          // add user ID to likes array
          post.likes.unshift({ user: req.user.id });

          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({ nopost: "This post is not found" })
        );
    });
  }
);

// @route   POST api/posts/unlike/:id
// @desc    Unlike post route
// @access  Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // if already liked
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "You have not liked this post yet" });
          }

          // remove user ID from likes array
          const newLikes = post.likes.filter(
            item => item.user.toString() !== req.user.id
          );
          post.likes = newLikes;

          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({ nopost: "This post is not found" })
        );
    });
  }
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to post route
// @access  Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const { text, name, avatar } = req.body;
        const newComment = {
          text,
          name,
          avatar,
          user: req.user.id
        };

        // add to comments array
        post.comments.unshift(newComment);

        // save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ nopost: "This post is not found" }));
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete comment from post route
// @access  Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // check to see if comment exists
        const commentToDelete = post.comments.find(
          comment => comment._id.toString() === req.params.comment_id
        );
        if (!commentToDelete)
          return res
            .status(404)
            .json({ nocomment: "The comment with this ID doesn't exist" });

        // check if the user is allowed to delete comment
        if (
          commentToDelete.user.toString() !== req.user.id &&
          post.user.toString() !== req.user.id
        )
          return res
            .status(400)
            .json({ norights: "You are not allowed to delete this comment" });

        // remove comment
        const newComments = post.comments.filter(
          comment => comment._id.toString() !== req.params.comment_id
        );
        post.comments = newComments;

        // save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ nopost: "This post is not found" }));
  }
);

module.exports = router;

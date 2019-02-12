const express = require("express");
const router = express.Router();

// @route   GET api/auth/test
// @desc    Tests auth route
// @access  Public
router.get("/test", (req, res) =>
  res.json({
    message: "Auth works!"
  })
);

module.exports = router;
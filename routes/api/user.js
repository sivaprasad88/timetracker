const express = require("express");
const router = express.Router();
//  @route  GET api/auth
//  @desc
//  @access Public
router.get("/", (req, res) => {
  res.send("User");
});

module.exports = router;

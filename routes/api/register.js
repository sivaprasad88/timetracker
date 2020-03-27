const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
//  @route  GET api/auth
//  @desc
//  @access Public
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Email is required").isEmail(),

    check("password", "Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 chars long"),
    check("password").custom((value, { req }) => {
      if (value !== req.body.passwordConfirmation) {
        throw new Error("Password confirmation is incorrect");
      } else {
        return true;
      }
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const { email, password, name } = req.body;

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      user = new User({
        name,
        email,
        password
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

module.exports = router;

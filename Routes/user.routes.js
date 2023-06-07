const { Router } = require("express");
const bcrypt = require("bcrypt");
const { UserModel } = require("../Models/user.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userRouter = Router();

userRouter.post("/register", async (req, res) => {
  const { email, name, pass } = req.body;
  try {
    bcrypt.hash(pass, 5, async (error, hash) => {
      if (error) {
        res.json({ msg: error.message });
      } else {
        const user = new UserModel({ name, email, pass: hash });
        await user.save();
        res.json({ msg: "User has been registered", user });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    const user = await UserModel.findOne({ email });

    if (user) {
      bcrypt.compare(pass, user.pass, (error, result) => {
        if (result) {
          let token = jwt.sign(
            { userID: user._id, user: user.name },
            process.env.SECRETE
          );

          res.json({ msg: "Logged in successfuly", token });
        } else {
          res.json({
            msg: "Please check your Credentials.",
          });
        }
      });
    } else {
      res.json({ msg: "User does not exist." });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error.message });
  }
});

module.exports = { userRouter };

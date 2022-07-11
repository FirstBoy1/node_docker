const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

async function signUp(req, res, next) {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  try {
    const newUser = await User.create({ username, password: hashedPassword });
    req.session.user = newUser;
    res.status(201).json({ status: "success", data: { user: newUser } });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "fail" });
  }
}

async function login(req, res, next) {
  const { username, password } = req.body;
  console.log({ username, password });
  try {
    const user = await User.find({ username });
    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "user not found" });
    }
    const isCorrect = await bcrypt.compare(password, user.password);
    if (isCorrect) {
      req.session.user = user;
      res.json({ status: "success" });
    } else {
      res.status(400).json({
        status: "fail",
        message: "incorrect username or password",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "fail" });
  }
}

module.exports = {
  signUp,
  login,
};

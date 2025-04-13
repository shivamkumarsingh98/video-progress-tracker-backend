const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing)
    return res.status(400).json({ msg: "Email already registered" });

  const hash = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hash });
  await user.save();
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  res
    .status(201)
    .json({
      token,
      userId: user._id,
      name: user.name,
      message: "User registered successfully",
    });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  res.json({ token, userId: user._id, name: user.name });
};

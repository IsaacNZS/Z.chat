const userDB = require("../Schemas/userSchemas");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const name = req.body.name;
    const password = req.body.password;
    const exitname = await userDB.findOne({ username: name });
    if (exitname) {
      return res.status(400).json({ con: false, msg: "This Name is Exited!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await new userDB({
      username: name,
      password: hashedPassword,
    }).save();
    return res.status(200).json({ con: true, msg: "Register Success!" });
  } catch (err) {
    console.log(err);
  }
};

const login = async (req, res) => {
  try {
    const name = req.body.name;
    const password = req.body.password;
    const exitname = await userDB.findOne({ username: name });
    if (!exitname) {
      return res.status(400).json({ con: false, msg: "This User Not Found!" });
    }
    const comfirm = await bcrypt.compare(password, exitname.password);
    if (!comfirm) {
      return res.status(400).json({ con: false, msg: "Wrong Password!" });
    }

    const token = jwt.sign(
      { id: exitname._id.toString() },
      process.env.SECRET_KEY,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600000 * 24 * 7,
    });
    const result = {
      name,
      createdAt: exitname.createdAt,
    };
    return res
      .status(200)
      .json({ con: true, msg: "Successfully Logined", result: result });
  } catch (error) {
    console.log(error);
  }
};

const logout = (req, res) => {
  res.cookie("token", "");
  res.json({ con: true, msg: "Succefully logouted!" });
};

const profile = async (req, res) => {
  const { id } = req.params;
  const result = await userDB.findById(id);
  res.status(200).json({ con: true, msg: "Userprofile", result: result });
};

const get = async (req, res) => {
  const myId = req.user.id;

  const result = await userDB.find({
    _id: { $ne: myId },
  });

  res.status(200).json({
    con: true,
    msg: "All User",
    result,
  });
};

const patch = async (req, res) => {
  const { id } = req.params;
  const img = req.body.img;
  const name = req.body.name;
  const bio = req.body.bio;

  const result = await userDB.findByIdAndUpdate(id, {
    username: name,
    profileimg: img,
    bio,
  });
  res
    .status(200)
    .json({ con: true, msg: "Successfully Updated", result: result });
};

const del = async (req, res) => {
  const { id } = req.params;
  await userDB.findByIdAndDelete(id);
  res.status(200).json({ con: true, msg: "Account Deleted" });
};

const userInfo = async (req, res) => {
  const user = req.user;
  res.status(200).json({ con: true, msg: "User Info", result: user });
};

module.exports = {
  login,
  register,
  logout,
  profile,
  get,
  patch,
  del,
  userInfo,
};

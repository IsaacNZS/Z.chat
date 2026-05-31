const userDB = require("../Schemas/userSchemas");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");

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
      secure: true,
      sameSite: "none",
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

//helper to save photo
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "profile-images",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const patch = async (req, res) => {
  try {
    let imageUrl;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);

      imageUrl = result.secure_url;
    }

    const updatedUser = await userDB.findByIdAndUpdate(
      req.params.id,
      {
        username: req.body.name,
        bio: req.body.bio,
        ...(imageUrl && { profileimg: imageUrl }),
      },
      {
        returnDocument: "after",
      },
    );

    res.status(200).json({
      con: true,
      msg: "Successfully Updated",
      user: updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Server Error",
    });
  }
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

const tokenpost = async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.user.id;

    await userDB.findByIdAndUpdate(userId, {
      fcmToken: token,
    });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
    });
  }
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
  tokenpost,
};

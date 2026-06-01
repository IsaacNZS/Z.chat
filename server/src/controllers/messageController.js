const userDB = require("../Schemas/userSchemas");
const messageDb = require("../Schemas/messageSchemas");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const admin = require("../firebaseAdmin");
const cloudinary = require("../utils/cloudinary");

const get = async (req, res) => {
  try {
    const userid = req.user.id;
    const { readerid } = req.params;

    if (!userid || !readerid) {
      return res.status(400).json({
        con: false,
        msg: "Need Id!",
      });
    }

    const messages = await messageDb
      .find({
        $or: [
          { senderId: userid, readerId: readerid },
          { senderId: readerid, readerId: userid },
        ],
      })
      .sort({ createdAt: 1 });

    res.status(200).json({
      con: true,
      msg: "All messages",
      result: messages,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      con: false,
      msg: "Server Error",
    });
  }
};

const post = async (req, res) => {
  try {
    const { readerid } = req.params;
    const userid = req.user.id;
    const postmsg = req.body.msg;
    const receiver = await userDB.findById(readerid);
    const sender = await userDB.findById(userid);

    if (!userid || !readerid) {
      return res.status(400).json({
        con: false,
        msg: "Need Id!",
      });
    }
    if (!postmsg) return null;

    const newMessage = await new messageDb({
      senderId: userid,
      readerId: readerid,
      content: postmsg,
    }).save();

    if (receiver?.fcmToken) {
      const test = await admin.messaging().send({
        token: receiver.fcmToken,
        data: {
          title: sender.username,
          body: postmsg,
          image: String(sender.profileimg || ""),
          senderId: String(sender._id),
        },
      });
    }

    return res
      .status(200)
      .json({ con: true, msg: "Message Success!", result: newMessage });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      con: false,
      msg: "Server Error",
    });
  }
};

const del = async (req, res) => {
  const { id } = req.params;
  const delmeseage = await messageDb.findByIdAndDelete(id);
  res
    .status(200)
    .json({ con: true, msg: "Message Deleted", result: delmeseage });
};

const friends = async (req, res) => {
  try {
    const { id } = req.params;

    const myfriendmsg = await messageDb.find({
      senderId: id,
    });

    const friendIds = myfriendmsg.map((friend) => friend.readerId);

    const uniqueIds = [...new Set(friendIds)];

    const result = await userDB.find({
      _id: { $in: uniqueIds },
    });

    res.status(200).json({
      con: true,
      result,
    });
  } catch (error) {
    console.log(error);
  }
};

const unread = async (req, res) => {
  const { id } = req.params;
  const msg = await messageDb.find({
    readerId: id,
    seen: false,
  });
  res.status(200).json({ con: true, msg: "success", result: msg });
};

module.exports = {
  get,
  post,
  del,
  unread,
  friends,
};

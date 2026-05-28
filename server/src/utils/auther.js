const jwt = require("jsonwebtoken");
const userDb = require("../Schemas/userSchemas");

const protectroute = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(400).json({ con: false, msg: "No Token!" });
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    if (!decode)
      return res.status(400).json({ con: true, msg: "Token is Wrong!" });
    const user = await userDb.findById(decode.id);
    if (!user)
      return res.status(400).json({ con: true, msg: "user not found!" });
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = protectroute;

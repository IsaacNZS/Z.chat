const { StreamChat } = require("stream-chat");
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

const serverClient = StreamChat.getInstance(apiKey, apiSecret);

// 👉 token generate API
const generateToken = async (req, res) => {
  try {
    const { userId, name } = req.body;

    // user create/update
    await serverClient.upsertUser({
      id: userId,
      name: name,
    });

    // token generate
    const token = serverClient.createToken(userId);

    res.json({ token, apiKey });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { generateToken };

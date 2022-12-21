const router = require("express").Router();
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
const { service } = require("../../startup/socketComm");

router.post("/login", async (req, res) => {
  try {
    const token = req.body.token;
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const client = new OAuth2Client(CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
    });
    const payload = ticket.getPayload();
    res.send({
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    });
  } catch (error) {
    return res.status(400).json({ message: "Invalid Token" });
  }
});

router.post("/machine-defination", async (req, res) => {
  try {
    const machineDefinationJson = req.body.defination;
    const machineDefination = JSON.parse(machineDefinationJson);
    service.send({ type: "initialize", data: machineDefination });
    res.send("Bot Initialized");
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Bot not Initialized" });
  }
});

module.exports = router;

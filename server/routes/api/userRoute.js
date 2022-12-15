const router = require("express").Router();
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");

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
    return res.status(400).json({ message: 'Invalid Token' });
  }
});

router.get("/machine-defination",async(req,res)=>{
  const machineDefinationJson = req.body;
  const machineDefination = JSON.parse(machineDefinationJson);
  
})

module.exports = router;

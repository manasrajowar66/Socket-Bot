const router = require("express").Router();
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
const { service: socketService } = require("../../startup/socketComm");
const { service: telegramService } = require("../../startup/telegramComm");
const { match } = require("../../service/botService");

const checkMethodsIsPresentInService = (states) => {
  for (const state in states) {
    if (states[state].on) {
      for (const event in states[state].on) {
        if (
          states[state].on[event].actions &&
          !match(states[state].on[event].actions)
        ) {
          throw new Error(
            `${states[state].on[event].actions} action is not exist`
          );
        }
        if (
          states[state].on[event].cond &&
          !match(states[state].on[event].cond)
        ) {
          throw new Error(
            `${states[state].on[event].cond} condition is not exist`
          );
        }
      }
    }
    if (states[state].onEntry) {
      if (states[state].onEntry && !match(states[state].onEntry)) {
        throw new Error(`${states[state].onEntry} method is not exist`);
      }
    }
  }
};

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

router.post("/machine-definition", async (req, res) => {
  try {
    const machineDefinitionJson = req.body.definition;
    const machineDefinition = JSON.parse(machineDefinitionJson);
    checkMethodsIsPresentInService(machineDefinition.states);
    const { type } = machineDefinition;
    if (type && type === "telegram-bot") {
      telegramService.send({ type: "initialize", data: machineDefinition });
    } else {
      socketService.send({ type: "initialize", data: machineDefinition });
    }
    res.send("Bot Initialized");
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;

const { createMachine, assign, interpret } = require("xstate");
require("dotenv").config();
const messages = {
  hello: "hello are you looking for job change ?  ",
  name: "what is your name?  ",
  experience: "how much experience do you have in years?   ",
  skills: "please enter your skills(comma seperated)   ",
  contacthr: "thanks for contacting us   ",
  review: "please review TFT's work culture?   ",
};

const defaultMachine = {
  id: "bot1",
  predictableActionArguments: true,
  initial: "idle",
  context: {},
  states: {
    idle: {},
  },
  events: {
    idle: [""],
  },
  messages: {
    idle: "Welcome to the Chat bot",
  },
};

const machine = createMachine(
  {
    id: "bot2",
    predictableActionArguments: true,
    initial: "idle",
    context: {
      machine: defaultMachine,
    },
    states: {
      idle: {
        on: {
          initialize: {
            actions: "initializeBot",
          },
        },
      },
    },
  },
  {
    actions: {
      initializeBot: assign({
        machine: (context, event) => event.data,
      }),
    },
  }
);

module.exports = { machine };

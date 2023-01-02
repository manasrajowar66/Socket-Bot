const { createMachine, assign, interpret } = require("xstate");
require("dotenv").config();


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

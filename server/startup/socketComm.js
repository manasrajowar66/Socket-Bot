const {Server} = require('socket.io');
require('dotenv').config();
const { createMachine, assign, interpret } = require("xstate");
const { machine } = require("../machine");
const {
  isText,
  isNum,
  storeText,
  storeContextToDb,
} = require("../service/botService");

let currMachineDefinition;
let service2;
let currState;

//creating service for machine state
const service = interpret(machine)
  .onTransition((state) => {
    //store current state in currState
    currMachineDefinition = state.context.machine;
    try {
      const machine2 = createMachine(
        {
          id: currMachineDefinition.id,
          initial: currMachineDefinition.initial,
          context: currMachineDefinition.context,
          predictableActionArguments:
            currMachineDefinition.predictableActionArguments,
          states: currMachineDefinition.states,
        },
        {
          actions: {
            storeText: assign({
              data: (context, event) => storeText(context, event, currState),
            }),
            storeContextToDb: (context, event) => storeContextToDb(context),
          },
          guards: {
            isText: (context, event) => isText(event.data),
            isNum: (context, event) => isNum(event.data),
          },
        }
      );
      service2 = interpret(machine2).onTransition((state) => {
        //store current state in currState
        currState = state;
      });
      service2.start();
    } catch (error) {
      console.log(error);
    }
  })
  .start();

const myModule = (module.exports = async (server) => {
  const io = new Server(server, {
    cors: "http://localhost:3000",
  });

  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("joined", () => {
      socket.emit("message", {
        user: "admin",
        data: {
          msg: currMachineDefinition.messages[currState.value],
          options: currMachineDefinition.events[currState.value].filter(
            (event) => event && event !== "TRIGGER"
          ),
        },
        type: "incoming",
      });
    });

    socket.on("message", async ({ type, message }) => {
      if (!currState.done) {
        socket.emit("message", {
          user: "admin",
          data: {
            msg: message,
          },
          type: "outgoing",
        });

        await service2.send({ type: type ? type : "TRIGGER", data: message });

        socket.emit("message", {
          user: "admin",
          data: {
            msg: currMachineDefinition.messages[currState.value],
            options: currMachineDefinition.events[currState.value].filter(
              (event) => event && event !== "TRIGGER"
            ),
          },
          type: "incoming",
        });
      }
    });
    socket.on("disconnect", () => {
      console.log(`User Left`);
    });
  });
});

myModule.service = service;
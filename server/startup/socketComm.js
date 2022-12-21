const {Server} = require('socket.io');
require('dotenv').config();
const { createMachine, assign, interpret } = require("xstate");
const { machine } = require("../machine");

let currMachineDefination;
let service2;
let currState;

//creating service for machine state
const service = interpret(machine)
  .onTransition((state) => {
    //store current state in currState
    currMachineDefination = state.context.machine;
    try {
      const machine2 = createMachine(
        {
          id: currMachineDefination.id,
          initial: currMachineDefination.initial,
          context: currMachineDefination.context,
          predictableActionArguments:
            currMachineDefination.predictableActionArguments,
          states: currMachineDefination.states,
        },
        {
          actions: {
            storeText: assign({
              data: (context, event) => {
                return { ...context.data, [currState.value]: event.data };
              },
            }),
            storeContextToDb: (context, event) => {
              console.log(context);
            },
          },
          guards: {
            isText: (context, event) => {
              return event.data !== "";
            },
            isNum: (context, event) => {
              return event.data !== "";
            },
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
          msg: currMachineDefination.messages[currState.value],
          options: currMachineDefination.events[currState.value].filter(
            (event) => event && event !== "TRIGGER"
          ),
        },
        type: "incomming",
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
            msg: currMachineDefination.messages[currState.value],
            options: currMachineDefination.events[currState.value].filter(
              (event) => event && event !== "TRIGGER"
            ),
          },
          type: "incomming",
        });
      }
    });
    socket.on("disconnect", () => {
      console.log(`User Left`);
    });
  });
});

myModule.service = service;
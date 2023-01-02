require("dotenv").config();
const { createMachine, assign, interpret } = require("xstate");
const { machine } = require("../machine");
const telegraf = require("telegraf");
const {
  isText,
  isNum,
  storeText,
  storeContextToDb,
} = require("../service/botService");

let currMachineDefinition;
let service2;
let currState;
let options;

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
        options = currMachineDefinition.events[currState.value].filter(
          (event) => event && event !== "TRIGGER"
        );
      });
      service2.start();
    } catch (error) {
      console.log(error);
    }
  })
  .start();

const createMessage = async () => {
  let msg = currMachineDefinition.messages[currState.value];
  options.forEach((option) => {
    msg += `\n/${option}\n`;
  });
  return msg;
};

const myModule = (module.exports = async (server) => {
  //Telegraf Bot create
  const bot = new telegraf(process.env.TELEGRAM_TOKEN);

  bot.start(async (ctx) => {
    ctx.reply(await createMessage());
  });

  bot.help((ctx) => {
    ctx.reply("You enter the help command!");
  });

  bot.settings((ctx) => {
    ctx.reply("You enter the settings command!");
  });

  bot.on("text", async (ctx) => {
    if (!currState.done) {
      const message = ctx.message.text;
      if (options.length > 0) {
        options.forEach(async (option) => {
          if (message.toLowerCase().includes(option.toLowerCase())) {
            await service2.send({ type: option, data: message });
          }
        });
      } else {
        await service2.send({ type: "TRIGGER", data: message });
      }
      ctx.reply(await createMessage());
    }
  });

  bot.launch();
});

myModule.service = service;

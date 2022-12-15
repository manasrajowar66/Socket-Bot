const { createMachine } = require("xstate");
require('dotenv').config();

//Creting a machine
const machine =
  /** @xstate-layout N4IgpgJg5mDOIC5QFsCeAjA9gF2QQwGMALASwDswA6EiAGzAGIBlAFQEEAlFgbQAYBdRKAAOmWCWwlMZISAAeiAIwA2RZQDMm9QBZt63juUBWAJwAaEKiW9tlAEx2TigBwm9AdlXvnAXx8W0LFxCUgpKMHwSWgA1PFoaPGxGAFEAWTYASQAZaLYsjIARNhZkvkEkEFFxSWlZBQRtO1sTdycjdztnZXUTO0ULKwRnNSNeMcVeDuN1ZTc-AIwcfGJyKmE8WFgAd0wAJwhY+IhExgAFNiYmAHUAeQ4C3PyikrLZKokpGQr651dKZQBAP07gmrW0A0Qw0oo3Gkzs01m2j8-hAZEwEDgskCSxCqzeYg+tW+iAAtMoIQgyfMQNjgiswjR6Pjqp86ohGhSJrYOk5XB4vK1qbTlqEqBE8FFDgkkszCV9QPU7O51JQVIC+opdCYjOpOTZKDyVNoWtojKYmkLFnTRZR1psdvspccZRV3jV5fJEO5eEZ-u5vUZGsobMo7HruY4XG51J5FP6TJagiLVpRYABXAgEODwV0E91shCKOzqX3eIvqVxNeHucGWawq7StFRm5wB5TK5E+IA */
  createMachine(
    {
      id: "mybotmachine",
      initial: "idle",
      predictableActionArguments: true,
      context: {
        PASSWORD: process.env.FIXED_USER_PASSWORD,
        EMAIL: "",
      },
      states: {
        idle: {
          on: {
            START: "emailValidate",
          },
        },
        emailValidate: {
          on: {
            EMAILVALIDATE: {
              target: "passwordValidate",
              cond: "checkEmail",
              actions: (context, event) => {},
            },
          },
        },
        passwordValidate: {
          on: {
            PASSWORDVALIDATE: {
              target: "success",
              cond: "checkPassword",
              actions: (context, event) => {},
            },
          },
        },
        success: {
          type: "final",
        },
      },
    },
    {
      actions: {},
      guards: {
        checkEmail: (context, event) => {
          return true;
        },
        checkPassword: (context, event) => {
          return true;
        },
      },
    }
  );


const getMachineDefination = ()=>{
      
}

const machine2 = createMachine()

module.exports = machine;

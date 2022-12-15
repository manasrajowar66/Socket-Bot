import { assign, createMachine } from "xstate";

const userMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QFdZgE4FkCGBjAFgJYB2YAdIRADZgDEA2gAwC6ioADgPayEAuhnYmxAAPRAEYAbOLIBmebIAsjABxKA7OtkBWADQgAnoiXayATinrxjWZNXXtAX0f7UGHARLlKNBuNZIIFw8-ILCYghSMgpKqhpaeoYSZopy2oriFopWkmaSiirOrmhYeESkZFScUCS0ADIA8gDiDQCqACpMARzcfAJCgRHa4jKSY-nSsioqVtqS+kYIKjLajGuM2rJS8mayRSBupZ4VVVCcyLz1zQCSAHJdwsF9YYOIw4xkBXniAExqKtkfj8FhJNJ9tGptN9VuJtOonPtiJwIHBhIcPOUwI9eqEBqAIgBaeZJBBEsjrCmUtbqfbospeCjULGBJ648KIRTAknydRkeFrZRmMxWdQWSS0koYhmnEjYkL9dkISQAsjK+HpH7qRRQ7IghDyVLpcTqRjKlQ-aSKPIS9z0k7Vc68OXPPGiYwqSRkWGSTU-Na2MwzRKLTI-VWMDLC8TLY2cxTOZxAA */
  createMachine(
    {
      id: "userMachine",
      initial: "idle",
      predictableActionArguments: true,
      context: {
        isAuthenticated: false,
        user: {
          name: "",
          email: "",
          picture: "",
        },
        messages: [],
      },
      states: {
        idle: {
          always: [
            { target: "login", cond: "checkAuthentication" },
            { target: "logout" },
          ],
        },
        login: {
          on: {
            LOGOUT: {
              target: "logout",
              actions: "clearUserData",
            },
            ADD_MESSAGE: {
              actions: "addMessage",
            },
          },
        },
        logout: {
          on: {
            LOGIN: {
              actions: "storeUserData",
              target: "login",
            },
          },
        },
      },
    },
    {
      actions: {
        clearUserData: assign({ isAuthenticated: false, user: {} }),
        storeUserData: assign({
          isAuthenticated: true,
          user: (context, event) => event.data.user,
          messages: [],
        }),
        addMessage: assign({
          isAuthenticated: (context) => context.isAuthenticated,
          user: (context) => context.user,
          messages: (context, event) => [...context.messages, event.data],
        }),
      },
      guards: {
        checkAuthentication: (context, event) => {
          if (context.isAuthenticated) return true;
          return false;
        },
      },
      services: {},
    }
  );

export { userMachine };

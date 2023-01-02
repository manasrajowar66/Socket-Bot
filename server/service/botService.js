const isText = (data) => {
  return data !== "";
};

const isNum = (data) => {
  return /^\d+$/.test(data);
};

const storeText = (context, event, currState) => {
  return { ...context.data, [currState.value]: event.data };
};

const storeContextToDb = (context) => {
  console.log(context);
};

const methodNames = ["isText", "isNum", "storeText", "storeContextToDb"];
const match = (value) => {
  for (let i = 0; i < methodNames.length; i++) {
    if (methodNames[i] === value) return true;
  }
  return false;
};

module.exports = { isText, isNum, storeText, storeContextToDb, match };

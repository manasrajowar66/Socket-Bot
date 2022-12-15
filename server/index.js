const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

(async()=>{
    await require('./startup/routeHandling')(app);
    await require('./startup/socketComm')(server);
    await require('./startup/httpServer')(server);
})();












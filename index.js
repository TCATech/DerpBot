const DerpBot = require("./structures/Client");
const keepAlive = require('./server')
new DerpBot().start(process.env.TOKEN, "./commands");
keepAlive()
const dotenv = require("dotenv")
dotenv.config()
const start = require("./server");
const port = process.env.PORT ;
start(port)
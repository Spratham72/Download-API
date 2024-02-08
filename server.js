const express = require("express");
const googleAuthController = require("./controller/googleController")
const app = express();
app.use(express.json());
app.use("/google", googleAuthController);
const start = (port) => {
    app.listen(port, ()=>{
        console.log(`app is live in port: ${port}`)
    })
}

module.exports = start;
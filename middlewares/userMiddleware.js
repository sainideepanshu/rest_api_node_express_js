const fs = require("fs");

function logReqRes(fileName) {   // this function is returning a function, we are using closures here
  console.log("Hello from Middleware 1");

  return (req, res, next) => {
    fs.appendFile(
      fileName,
      `\n ${Date.now()} : ${req.ip} : ${req.method} : ${req.path} `,
      (err, data) => {
        req.myUsername = "Ram Rajya";

        next();
      }
    );
  };
}

module.exports = { logReqRes };

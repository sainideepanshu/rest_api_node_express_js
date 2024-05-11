const express = require("express");
const app = express();
const { connectToMongoDB } = require("./connection.js");
const userRouter = require("./routes/user.js");
const { logReqRes } = require("./middlewares/userMiddleware.js");

//MongoDB connection

connectToMongoDB("mongodb://127.0.0.1:27017/rest-api-node-express-js");


// Middleware

/*

https://expressjs.com/en/guide/writing-middleware.html
https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers

Middleware functions can perform the following tasks:

    Execute any code.
    Make changes to the request and the response objects.
    End the request-response cycle.
    Call the next middleware in the stack.

*/

//this middleware check the Content-Type header which is a request header and do the parsing on the basis of that
//For example whenever a post request comes it checks the Content-Type request header

/**
 * Returns middleware that only parses urlencoded bodies and only looks at requests
 * where the Content-Type header matches the type option
 */

// this middleware parse the data and put it in req.body
app.use(express.urlencoded({ extended: false })); // Middleware that is helping in parsing ,

app.use(logReqRes("log.txt"));

app.use((req, res, next) => {
  console.log("Hello from Middleware 2 ", req.myUsername);

  next();
});

const PORT = 8000;

// Routes

app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server started at PORT ${PORT}`);
});

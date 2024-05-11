const express = require("express");
const app = express();
const fs = require("fs");
const mongoose = require("mongoose");

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

app.use((req, res, next) => {
  console.log("Hello from Middleware 1");

  fs.appendFile(
    "log.txt",
    `\n ${Date.now()} : ${req.ip} : ${req.method} : ${req.path} `,
    (err, data) => {
      req.myUsername = "Ram Rajya";

      //return res.json({msg : "Hello from Middleware 1"});

      next();
    }
  );
});

app.use((req, res, next) => {
  console.log("Hello from Middleware 2 ", req.myUsername);

  //return res.end("Hello from Middleware 2");

  next();
});

const PORT = 8000;

//mongo db connection

mongoose
  .connect("mongodb://127.0.0.1:27017/rest-api-node-express-js")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB error ", err);
  });

//Schema

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  jobTitle: {
    type: String,
  },
  gender: {
    type: String,
  },
},{timestamps:true});

const User = mongoose.model("user", userSchema);

// /api/users and /users are examples of hybrid server

// it will render HTML document for browsers
// It is for server side rendering
app.get("/users", async (req, res) => {

  const allUserInDB = await User.find({});

  const html = `
    <ul>
        ${allUserInDB.map((user) => `<li>${user.firstName} - ${user.email}</li>`).join("")}
    </ul>
    `;

  return res.send(html);
});

// it will render json for mobile devices
// it will be used for client side rendering
app.get("/api/users", async (req, res) => {

  const allUserInDB = await User.find({});
  console.log(req.headers);

  //adding our own header in response
  res.setHeader("X-MyName", "Ram"); // Custom Header
  //Good Practice : ALways add X to custom headers for example 'X-Powered-By'

  console.log("I am in get route ", req.myUsername);
  return res.json(allUserInDB);
});

app
  .route("/api/users/:id")
  .get(async (req, res) => {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }
    return res.json(user);
  })
  .patch(async (req, res) => {

    const user = await User.findByIdAndUpdate(req.params.id,{lastName:"ji"});

    return res.json({ status: "success" });
  })
  .delete(async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ status: "success" });
  });

app.post("/api/users",async (req, res) => {
  const body = req.body;

  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  console.log(body);

  const result = await User.create({
    firstName:body.first_name,
    lastName:body.last_name,
    email:body.email,
    gender:body.gender,
    jobTitle:body.job_title
  });

  console.log("result ",result);


  return res.status(201).json({ msg: "User created success" });
  
});

app.listen(PORT, () => {
  console.log(`Server started at PORT ${PORT}`);
});

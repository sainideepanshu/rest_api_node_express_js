const express = require("express");
const app = express();
const fs = require("fs");
const users = require("./MOCK_DATA.json");

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
app.use(express.urlencoded({extended:false}));  // Middleware that is helping in parsing , 

app.use((req,res,next) => {

    console.log("Hello from Middleware 1");

    fs.appendFile("log.txt",`\n ${Date.now()} : ${req.ip} : ${req.method} : ${req.path} ` ,(err,data) => {

        req.myUsername = "Ram Rajya";

        //return res.json({msg : "Hello from Middleware 1"});

        next();
    });
      
});

app.use((req,res,next) => {

    console.log("Hello from Middleware 2 ",req.myUsername);

    //return res.end("Hello from Middleware 2");

     next();  
});


const PORT = 8000;


// /api/users and /users are examples of hybrid server 


// it will render HTML document for browsers
// It is for server side rendering
app.get("/users",(req,res) => {   

    const html = `
    <ul>
        ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;

    return res.send(html);
});

// it will render json for mobile devices
// it will be used for client side rendering
app.get("/api/users",(req,res) => {

    console.log(req.headers);

    //adding our own header in response
    res.setHeader("X-MyName","Ram");   // Custom Header
    //Good Practice : ALways add X to custom headers for example 'X-Powered-By'

    console.log("I am in get route ",req.myUsername);
    return res.json(users);
});

app
    .route("/api/users/:id")
    .get((req,res) => {

        const id = Number(req.params.id);
    
        const user = users.find((user) => user.id === id);

        if( !user ){
            return res.status(404).json({msg:"user not found"});
        }
        return res.json(user);
    })
    .patch((req,res) => {

        //TODO : Edit the user with id
        return res.json({status : "pending"});
    })
    .delete((req,res) => {

        //TODO : Delete the user with id
        return res.json({status : "pending"});
    });


app.post("/api/users",(req,res) => {

    const body = req.body;

    if( !body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title ){

        return res.status(400).json({msg:"All fields are required"});
    }

    console.log(body);

    users.push({...body,id:users.length+1});

    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data) => {

        return res.status(201).json({status : "success",id:users.length});
    });
});

app.listen(PORT,() => {

    console.log(`Server started at PORT ${PORT}`);
});
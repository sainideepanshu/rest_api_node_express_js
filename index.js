const express = require("express");
const app = express();
const fs = require("fs");

// Middleware

app.use(express.urlencoded({extended:false}));

const users = require("./MOCK_DATA.json");

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

    return res.json(users);
});

app
    .route("/api/users/:id")
    .get((req,res) => {

        const id = Number(req.params.id);
    
        const user = users.find((user) => user.id === id);
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

    console.log(body);

    users.push({...body,id:users.length+1});

    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data) => {

        return res.json({status : "success",id:users.length});
    });
});

app.listen(PORT,() => {

    console.log(`Server started at PORT ${PORT}`);
});
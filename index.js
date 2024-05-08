const express = require("express");
const app = express();

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


app.get("/api/users/:id",(req,res) => {

    const id = Number(req.params.id);

    const user = users.find((user) => user.id === id);
    return res.json(user);
});

app.post("/api/users",(req,res) => {

    //TODO : Create new user
    return res.json({status : "pending"});
});

app.patch("/api/users/:id",(req,res) => {

    //TODO : Edit the user with id
    return res.json({status : "pending"});
});

app.delete("/api/users/:id",(req,res) => {

    //TODO : Delete the user with id
    return res.json({status : "pending"});
});

app.listen(PORT,() => {

    console.log(`Server started at PORT ${PORT}`);
});
const mongoose = require("mongoose");

async function connectToMongoDB(url) {
  //mongo db connection

  mongoose
    .connect(url)
    .then(() => {
      console.log("MongoDB Connected");
    })
    .catch((err) => {
      console.log("MongoDB error ", err);
    });
}


module.exports = {connectToMongoDB,}
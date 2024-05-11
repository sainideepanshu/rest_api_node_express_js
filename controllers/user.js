const User = require("../models/user.js");

async function handleGetAllUsers(req, res) {
  const allUserInDB = await User.find({});
  console.log(req.headers);

  //adding our own header in response
  res.setHeader("X-MyName", "Ram"); // Custom Header
  //Good Practice : ALways add X to custom headers for example 'X-Powered-By'

  console.log("I am in get route ", req.myUsername);
  return res.json(allUserInDB);
}

async function handleGetUserById(req, res) {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ msg: "user not found" });
  }
  return res.json(user);
}

async function handleUpdateUserById(req, res) {
  const user = await User.findByIdAndUpdate(req.params.id, {
    lastName: "ji",
  });

  return res.json({ status: "success" });
}

async function handleDeleteUserById(req, res) {
  await User.findByIdAndDelete(req.params.id);
  return res.json({ status: "success" });
}

async function handleCreateNewUser(req, res) {
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
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });

  console.log("result ", result);

  return res.status(201).json({ msg: "User created success" ,id:result._id});
}

module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser,
};

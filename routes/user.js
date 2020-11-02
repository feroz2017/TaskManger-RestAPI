const express = require("express");
const { validateUser, User } = require("../models/user");
const validateObjectID = require("../middleware/validateObjectID");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/users/login", async (req, res) => {
  try {
    console.log(req.body.password);
    let user = await User.getByCredentials(req.body.email, req.body.password);
    const token = await user.getAuthtoken();
    res.send({ user, token });
  } catch (e) {
    res.send(e);
  }
});
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token != req.token);
    await req.user.save();
    res.send("You have been successfully Logout");
  } catch (e) {
    res.status(500).send("There is some Error with Server");
  }
});
router.post("/users/logoutAll",auth, async (req,res)=>{
  try{
    req.user.tokens = [];
    await req.user.save();
    res.send("You have been successfully logout from all devices!");
  }
  catch(e){
    console.log(e)
  }
});
router.get("/users/me", auth, async (req, res) => {
  // try {
  //   let user = await User.findById(req.params.id);
  //   if (!user) return res.status(404).send("User with given ID not found!");
  //   res.send(user);
  // } catch (e) {
  //   console.log(e);
  // }

  //  After adding authenticating
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  try {
    // let user = await User.findById(req.params.id);
    // if (!user) return res.status(404).send("The user with given ID not found");

    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    console.log(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndRemove(req.params.id);
    // if (!user) return res.status(404).send("The User with given ID not found!");
    const user = await User.findByIdAndRemove(req.user._id);
    res.send(user);
  } catch (e) {
    console.log(e);
  }
});
router.post("/users", async (req, res) => {
  // validating user inputs
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    // checking availability of user
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User Already Existed.");
    user = new User(req.body);
    await user.save();
    const token = await user.getAuthtoken();
    res.send({ user, token });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;

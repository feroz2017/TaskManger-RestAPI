const express = require("express");
const { validateUser, User } = require("../models/user");
const validateObjectID = require("../middleware/validateObjectID");
const router = new express.Router();

router.get("/users/:id", validateObjectID, async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User with given ID not found!");
    res.send(user);
  } catch (e) {
    console.log(e);
  }
});
router.patch("/users/:id", validateObjectID, async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    let user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).send("The user with given ID not found");
    res.send(user);
  } catch (e) {
    console.log(e);
  }
});
router.delete("/users/:id", validateObjectID, async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if(!user) return res.status(404).send("The User with given ID not found!");
    res.send(user);
  } catch (e) {console.log(e)}
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
    let result = await user.save();
    res.send(result);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;

const express = require("express");
const validateObjectID = require("../middleware/validateObjectID");
const { validateTask, Task } = require("../models/task");
const router = express.Router();

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.send(tasks);
  } catch (e) {
    res.send(e);
  }
});
router.patch("/tasks/:id", validateObjectID, async (req, res) => {
  const { error } = validateTask(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    let task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(task);
  } catch (e) {
    res.send(e);
  }
});
router.delete("/tasks/:id", validateObjectID, async (req, res) => {
  try {
    const task = await Task.findByIdAndRemove(req.params.id);
    if (!task) return res.status(404).send("Task with given ID not found!");
    res.send(task);
  } catch (e) {
    res.send(e);
  }
});
router.post("/tasks", async (req, res) => {
  const { error } = validateTask(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    let task = new Task(req.body);
    task = await task.save();
    res.send(task);
  } catch (e) {
    res.send(e);
  }
});
module.exports = router;

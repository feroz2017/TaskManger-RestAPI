const mongoose = require("mongoose");
const Joi = require("joi");

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});
validateTask = (task) => {
  joiSchema = Joi.object({
      description: Joi.string(),
      completed: Joi.boolean()
  });
  return joiSchema.validate(task);
};

exports.Task = mongoose.model("Task", taskSchema);
exports.validateTask = validateTask;

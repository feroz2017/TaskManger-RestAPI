const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    minlength: 7,
    trim: true,
  },
});

validateUser = (user) => {
    const joiSchema = Joi.object({
        name: Joi.string().min(5).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(7).required()
    });
    return joiSchema.validate(user);
};
exports.User = mongoose.model("User", userSchema);
exports.validateUser = validateUser;

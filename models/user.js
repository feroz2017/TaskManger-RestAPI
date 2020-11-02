//https://vegibit.com/node-js-blog-tutorial/
const mongoose = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    minlength: 7,
    trim: true,
  },
  tokens: [{ token: {
    type: String,
    required: true
  } }],
});

userSchema.methods.getAuthtoken = async function () {
  const token =  jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  this.tokens = this.tokens.concat({token});
  await this.save();
  //console.log(token)
  return token;
}

userSchema.statics.getByCredentials = async function (email, password) {
  const user = await User.findOne({email});
  if(!user) throw new Error("Unable to login");
  const verified = await bcrypt.compare(password,user.password);
  if(!verified) throw new Error("Unable to login");
  return user;
}

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

validateUser = (user) => {
  const joiSchema = Joi.object({
    name: Joi.string().min(5).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(7).required(),
  });
  return joiSchema.validate(user);
};
const User =  mongoose.model("User", userSchema);
exports.User = User;
exports.validateUser = validateUser;

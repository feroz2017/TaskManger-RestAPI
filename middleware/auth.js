const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const {User} = require('../models/user');
module.exports =async function (req,res,next) {
   try{
    const token = req.header('auth-token');
    const payload = jwt.verify(token,process.env.JWT_SECRET);
    const user = await User.findOne({
        _id: payload._id,
        'tokens.token': token
    });
    if(!user)  throw new Error({error: "Please do authenticate"});
    req.token = token;
    req.user = user;
    next();
   }
    catch(e){
    res.status(401).send({error: "Please do authenticate"});
}
}
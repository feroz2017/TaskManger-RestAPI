const express = require('express');
const app = express();
const UserRouter = require('./routes/user');
const TaskRouter = require('./routes/task');
const mongoose = require("mongoose");


mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
});
app.use(express.json());
app.use('/api/',UserRouter);
app.use('/api/',TaskRouter);
const port = process.env.PORT;
app.listen(port,()=>{
        console.log('Server is on '+port);
})

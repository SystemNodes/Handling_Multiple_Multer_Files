const mongoose = require('mongoose');
require('dotenv').config();

const DB = process.env.MONGODB_URI

mongoose.connect(DB)
.then(()=>{
    console.log('Database connected successfully');
}).catch((e)=>{
    console.log(`Error connecting to server; ${e.message}`);
})

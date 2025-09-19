const express = require('express');
require('./config/database');
const productRouter = require('./routers/productRouter');
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(productRouter);

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT: ${PORT}`);
})

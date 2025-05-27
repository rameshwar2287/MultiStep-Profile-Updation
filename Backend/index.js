const express=require("express");
const connectdb = require("./config");
const dotenv=require("dotenv").config();
const cors = require('cors');
connectdb();
const app=express();
const port=3000;
app.use(cors());

// const port=process.env.PORT||5000;
app.use(express.json());
app.use("/country",require('./Routes/countryRoutes'))
app.use("/api/user",require('./Routes/userRoutes'))

app.get('/', (req, res) => res.send('API is running...'));
app.listen(port,()=>{
    console.log(`App running at ${port}`);
})


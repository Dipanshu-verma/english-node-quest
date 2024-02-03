const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { AuthRoute } = require("./routes/authRoute.js");
const { mongoConnect } = require("./datebase/db.js");
const { PostRoute } = require("./routes/postRoute.js");

const PORT=  process.env.PORT ||8000
const app =  express();

app.use(express.json());
 app.use(cors());
 
app.use(AuthRoute)
app.use(PostRoute)
 


app.listen(PORT, async()=>{
    await mongoConnect();
    console.log(`server is running at ${PORT}`);
})
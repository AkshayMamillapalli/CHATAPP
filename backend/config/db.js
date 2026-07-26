const mongoose = require("mongoose");

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    }
    catch(err){
        console.log("Cannot connect MongoDB");
        console.log("Actual error : ",err);
        process.exit(1);
    }
}
module.exports = connectDB;
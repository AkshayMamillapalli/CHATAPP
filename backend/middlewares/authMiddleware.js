const jwt = require("jsonwebtoken");
const User = require("../models/Users.js");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req,res,next)=>{
    let token;

    if(
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    ){
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);

            req.user = await User.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if(!token){
        res.status(401);
        throw new Error("Not authorized,token failed");
    }
})

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403);
        throw new Error("Admin access only");
    }
};

module.exports = {protect, admin};
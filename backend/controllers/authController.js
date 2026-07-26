const User = require("../models/User");
const bcrypt = require("bcryptjs")
exports.register = async(req,res)=>{
    try {
        const {name,email,password} = req.body;
        const hashed = await bcrypt.hash(password,10);

        const user = new User({
            name,email,password:hashed
        })

        await user.save();
        res.json({message:"User registered succesfully"})
    } catch (err) {
        res.status(500).json({error:err.message});
    }
}
exports.login = async(req,res)=>{
    try {
        const {email,password} = req.body;

        const user = await User.findOne({email});

        if(!user) return res.status(404).json({message:"User not found"});

        const isMatch = await bcrypt.compare(password,user.password);
    
        if(!isMatch) return res.status(400).json({message:"Invalid Password"});

        res.json({
            success :true,
            message :"Login Succesful",
            userId : user._id
        })
    } catch (error) {
        res.status(500).json({error:err.message});
    }
}
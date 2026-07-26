const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },

    email: {
        type:String,
        unique:true
    },
    password: {
        type: String,
        required: true,
    }, 
    isAdmin: {
        type: Boolean,
        default: false,
    },
},
{
    timestamps: true,
});

userSchema.methods.matchPassword=async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.pre("save", async function (next) {
    if(!this.isModified){
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});
const User = mongoose.model("User", userSchema);

module.exports = User;
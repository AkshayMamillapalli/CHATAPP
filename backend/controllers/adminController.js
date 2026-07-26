const asyncHandler = require("express-async-handler");
const User = require("../models/Users");

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
        .select("-password")
        .sort({ createdAt: -1 });

    res.status(200).json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    if (user._id.toString() === req.user._id.toString()) {
        res.status(400);
        throw new Error("You cannot delete your own account");
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        message: "User deleted successfully",
    });
});

module.exports = {
    getAllUsers,
    deleteUser,
};
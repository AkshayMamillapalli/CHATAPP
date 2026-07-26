const AsyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Users = require("../models/Users");
const Chat = require("../models/chatModel");

const sendMessage = AsyncHandler(async (req,res) => {
    const {content,chatId} = req.body;

    if(!content || !chatId){
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }
    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender","name");
        message = await message.populate("chat");
        message = await Users.populate(message,{
             path: "chat.users",
             select: "name email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        });

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}); 

const allMessages = AsyncHandler(async (req,res)=>{
    try {
        const messages = await Message.find({chat:req.params.chatId}).populate(
            "sender",
            "name email"
        ).populate("chat");

        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

const searchMessages = AsyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const { query } = req.query;

    if (!query || query.trim() === "") {
        return res.json([]);
    }

    try {
        const messages = await Message.find({
            chat: chatId,
            content: {
                $regex: query,
                $options: "i",
            },
        })
            .populate("sender", "name email")
            .populate("chat")
            .sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500);
        throw new Error("Failed to search messages");
    }
});
module.exports = {sendMessage, allMessages, searchMessages};
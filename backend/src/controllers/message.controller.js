import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user.id; // Assuming you have user ID in req.user after authentication
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error fetching users for sidebar:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        
        const myId = req.user.id; // Assuming you have user ID in req.user after authentication
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        });
        res.status(200).json(messages);

    } catch (error) {
        console.log("Error fetching messages: ", error);
        res.status(500).json({ message: "Internal server error" });   
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const { text, image } = req.body; // Assuming you're sending text and image in the request body

        const senderId = req.user.id; // Assuming you have user ID in req.user after authentication
        
        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();
        // realtime functionality
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
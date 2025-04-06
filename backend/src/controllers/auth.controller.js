import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // hash password
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullname: fullname,
            email: email,
            password: hashedPassword,
        });
        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            return res.status(201).json(newUser);
        }
        else {
            return res.status(500).json({ message: "User creation failed" });
        }
    } catch (error) {
        console.error("error in signup controller", error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        generateToken(user._id, res);
        return res.status(200).json(user);

    } catch (error) {
        console.log("error in login controller", error);
        return res.status(500).json({ message: "Internal Server error" });
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0,
        })
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.log("error in logout controller", error);
        return res.status(500).json({ message: "Internal Server error" });
    }
}


export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;
        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture is required" });
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: uploadResponse.secure_url,
        }, { new: true });
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error in updateProfile controller", error);
        return res.status(500).json({ message: "Internal Server error" });
    }
}

export const checkAuth = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.log("error in checkAuth controller", error);
        return res.status(500).json({ message: "Internal Server error" });
    }
}
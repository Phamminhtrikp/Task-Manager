const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate jwt token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '12d' });
};

// @desc    Register a new User
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImgUrl, adminInviteToken } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ messsage: "User already exists" });
        }

        // Determine user role: Admin if correct token is provided, otherwise Member
        let role = "member";
        if (adminInviteToken && adminInviteToken == process.env.ADMIN_INVITE_TOKEN) {
            role = "admin";
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImgUrl,
            role
        });

        // Return user data with jwt token
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImgUrl: user.profileImgUrl,
            token: generateToken(user._id)
        });

    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err.meassage });
    }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        // Extract email and password from the request body
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password); // Compare the provided password with the hashed password

        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate user data with jwt token
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImgUrl: user.profileImgUrl,
            token: generateToken(user._id) // Generate a JWT token for the user
        });

    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err.meassage });
    }
};

// @desc    Get the User profile
// @route   GET /api/auth/profile
// @access  Private { requires JWT token }
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password"); // Exclude password from the response

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);

    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err.meassage });
    }
};

// @desc    Update the User profile
// @route   PATCH /api/auth/profile
// @access  Private { requires JWT token }
const updateUserProfile = async (req, res) => {
    try {
        const { name, email, password, profileImgUrl } = req.body; // Extract data from the request body

        const user = await User.findById(req.user._id); // Find the user by ID

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user details
        user.name = name || user.name;
        user.email = email || user.email;
        user.profileImgUrl = profileImgUrl || user.profileImgUrl;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await user.save(); // Save the updated user

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            profileImgUrl: updatedUser.profileImgUrl,
            token: generateToken(updatedUser._id) // Generate a new JWT token for the updated user
        });

    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err.meassage });
    }
};


module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile
};
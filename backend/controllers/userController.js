const User = require('../models/User');
const Task = require('../models/Task');
const bcrypt = require('bcryptjs');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'member' }).select('-password');

        // Add task counts to each user
        const userWithTaskCount = await Promise.all(users.map(async (user) => {
            const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: 'Pending' });
            const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: 'In Progress' });
            const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: 'Completed' });

            return {
                ...user._doc, // Include all existing user data
                pendingTasks,
                inProgressTasks,
                completedTasks
            };
        }));

        res.status(200).json(userWithTaskCount);
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
/** 
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete associated tasks
        await Task.deleteMany({ user: req.params.id });

        await user.remove();
        res.status(200).json({ message: 'User removed' });
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
*/

module.exports = {
    getUsers,
    getUserById,
};
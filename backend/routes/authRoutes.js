const { 
    loginUser, 
    registerUser, 
    getUserProfile, 
    updateUserProfile 
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const upload = require("../middlewares/uploadMiddleware");

const express = require('express');

const router = express.Router();

// Authentication routes
router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

router.post('/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
});

module.exports = router;
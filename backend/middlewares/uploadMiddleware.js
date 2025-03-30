const multer = require('multer');

// Configure storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname); // Unique filename
        console.log(file);
    },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept file
    } 
    else {
        cb(new Error('Invalid file type, only .jpeg, .png and .jpg are allowed!'), false); // Reject file
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload; // Export the configured multer instance
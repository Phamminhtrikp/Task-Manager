const mongoose = require('mongoose');
const { create } = require('./User');

const todoSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
});

const taskSkema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    dueDate: { type: Date, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user assigned to the task
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user who created the task
    attachments: [{ type: String }], // Array of attachment URLs
    todoCheckList: [todoSchema], // Array of todo items
    progress: { type: Number, default: 0 }, // Progress percentage (0-100)
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSkema);
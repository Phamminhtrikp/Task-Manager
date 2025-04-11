const Task = require('../models/Task');


/***
 * @desc    Get all tasks (Admin: all, Member: only assigned tasks)
 * @route   GET /api/tasks/
 * @access  Private (Admin: all, Member: only assigned tasks)
 */
const getTasks = async (req, res) => {
    try {
        const { status } = req.query; // Get status from query parameters
        let filter = {};

        if (status) {
            filter.status = status; // Filter by status if provided
        }

        let tasks;

        if (req.user.role === "admin") {
            tasks = await Task.find(filter).populate(
                "assignedTo",
                "name email profileImgUrl"
            );
        }
        else {
            tasks = await Task.find({
                ...filter,
                assignedTo: req.user._id // Only get tasks assigned to the logged-in user
            }).populate(
                "assignedTo",
                "name email profileImgUrl"
            );
        }

        // Add completed todoCheckList count to each task
        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.todoCheckList.filter(item => item.completed).length;
                return { ...task._doc, completedCount };
            })
        );

        // Status summary counts
        const allTasks = await Task.countDocuments(
            req.user.role === "admin" ? {} : { assignedTo: req.user._id }
        );

        const pendingTasks = await Task.countDocuments({
            ...filter,
            status: "Pending",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        });

        const inProgressTasks = await Task.countDocuments({
            ...filter,
            status: "In Progress",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        });

        const completedTasks = await Task.countDocuments({
            ...filter,
            status: "Completed",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        });

        res.status(200).json({
            tasks,
            statusSummary: {
                all: allTasks,
                pending: pendingTasks,
                inProgress: inProgressTasks,
                completed: completedTasks
            }
        });
    } 
    catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

/***
 * @desc    Get task by ID
 * @route   GET /api/tasks/:id
 * @eccess  Private
 */
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImgUrl"
        );
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } 
    catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

/***
 * @desc    Create a new task (Admin only)
 * @route   POST /api/tasks
 * @access  Private (Admin only)
 */
const createTask = async (req, res) => {
    try {
        const { title, description, priority, assignedTo, dueDate, attachments, todoCheckList } = req.body;

        if (!Array.isArray(assignedTo)) {
            return res.status(400).json({ message: 'AssignedTo must be an array of user IDs' });
        }

        const task = await Task.create({
            title,
            description,
            priority,
            assignedTo,
            dueDate,
            createdBy: req.user._id,
            attachments,
            todoCheckList
        });

        res.status(201).json({ message: 'Task created successfully', task: task });
    } 
    catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

/***
 * @desc    Update task details
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Only allow updating certain fields
        const { title, description, priority, assignedTo, dueDate, attachments, todoCheckList } = req.body;
        task.title = title || task.title;
        task.description = description || task.description;
        task.priority = priority || task.priority;
        task.dueDate = dueDate || task.dueDate;
        task.attachments = attachments || task.attachments;
        task.todoCheckList = todoCheckList || task.todoCheckList;

        if (assignedTo) {
            if (!Array.isArray(assignedTo)) {
                return res.status(400).json({ message: 'AssignedTo must be an array of user IDs' });
            }
            task.assignedTo = assignedTo;
        }

        const updatedTask = await task.save();
        res.status(200).json({ message: 'Task updated successfully', updatedTask });
    } 
    catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

/***
 * @desc    Delete task (Admin only)
 * @route   DELETE /api/tasks/:id
 * @access  Private (Admin only)
 */
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await task.deleteOne();
        res.status(200).json({ message: 'Task deleted successfully' });
    } 
    catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

/***
 * @desc    Update task status
 * @route   PUT /api/tasks/:id/status
 * @access  Private
 */
const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        console.log(task)
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        const isAssigned = task.assignedTo.some(
            (userId) => userId.toString() === req.user._id.toString()
        );

        if (!isAssigned && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to update this task' });
        }

        const { status } = req.body;
        
        task.status = status || task.status; // Update status if provided

        if (status === 'Completed') {
            task.todoCheckList.forEach(item => {item.completed = true;}); // Mark all checklist items as completed
            task.progress = 100; // Set progress to 100%
        }

        const updatedTask = await task.save();
        res.status(200).json({ message: 'Task status updated successfully', updatedTask });
    } 
    catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

/***
 * @desc    Update task checklist (todo)
 * @route   PUT /api/tasks/:id/todo
 * @access  Private
 */
const updateTaskChecklist = async (req, res) => {
    try {
        const { todoCheckList } = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (!task.assignedTo.includes(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to update this task' });
        }

        task.todoCheckList = todoCheckList || task.todoCheckList; // Update checklist if provided

        // Automatically update progress based on checklist completion
        const completedCount = task.todoCheckList.filter(item => item.completed).length;
        const totalItems = task.todoCheckList.length;
        task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0; // Calculate progress percentage

        // Auto-mark task as completed if all checklist items are done
        if (task.progress === 100) {
            task.status = 'Completed';
        }
        else if (task.progress > 0) {
            task.status = 'In Progress';
        }
        else {
            task.status = 'Pending';
        }

        await task.save();
        const updatedTask = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImgUrl"
        );

        res.status(200).json({ message: 'Task checklist updated successfully', task: updatedTask });
    } 
    catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

/***
 * @desc    Get dashboard data (Admin)
 * @route   GET /api/tasks/dashboard-data
 * @access  Private
 */
const getDashboardData = async (req, res) => {
    try {
        // Fetch Statistics for the dashboard
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({ status: 'Pending' });
        const inProgressTasks = await Task.countDocuments({ status: 'In Progress' });
        const completedTasks = await Task.countDocuments({ status: 'Completed' });
        const overdueTasks = await Task.countDocuments({ 
            dueDate: { $lt: new Date() }, 
            status: { $ne: 'Completed' } 
        });

        // Ensure all possible statuses are included in the response
        const taskStatuses = ["Pending", "In Progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([
            { $group: { 
                _id: "$status", 
                count: { $sum: 1 } 
                },
            },
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, '').trim(); // Remove spaces for response keys
            acc[formattedKey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});

        // Add total count to taskDistribution
        taskDistribution['All'] = totalTasks;

        // Ensure all priorities are included in the response
        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelsRaw = await Task.aggregate([
            { $group: { 
                _id: "$priority", 
                count: { $sum: 1 } 
                },
            },
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = taskPriorityLevelsRaw.find((item) => item._id === priority) ?. count || 0;
            return acc;
        }, {});

        // Fetch recent 10 tasks
        const recentTasks = await Task.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt")
        ;

        res.status(200).json({
            satisfies: {
                totalTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });

    } 
    catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

/***
 * @desc    Get user dashboard data (User-specific)
 * @route   GET /api/tasks/user-dashboard-data
 * @access  Private
 */
const getUserDashboardData = async (req, res) => {
    try {
        const userId = req.user._id; // Only fecth data for the logged-in user

        // Fetch Statistics for the dashboard
        const totalTasks = await Task.countDocuments({ assignedTo: userId });
        const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: 'Pending' });
        const completedTasks = await Task.countDocuments({ assignedTo: userId, status: 'Completed' });
        const overdueTasks = await Task.countDocuments({ 
            assignedTo: userId, 
            dueDate: { $lt: new Date() }, 
            status: { $ne: 'Completed' } 
        });


        // Task Distribution by Status
        const taskStatuses = ["Pending", "In Progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            { $group: { 
                _id: "$status", 
                count: { $sum: 1 } 
                },
            },
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, '').trim();
            acc[formattedKey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});
        
        taskDistribution['All'] = totalTasks; // Add total count to taskDistribution
        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelsRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            { $group: { 
                _id: "$priority", 
                count: { $sum: 1 } 
                },
            },
        ]);
        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
            return acc;
        }, {});

        // Fetch recent 10 tasks
        const recentTasks = await Task.find({ assignedTo: userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt")
        ;
        
        res.status(200).json({
            satisfies: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });
    } 
    catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    getUserDashboardData
};
const User = require('../models/User');
const Task = require('../models/Task');
const excelJS = require('exceljs');

/***
 * @desc    Export all tasks as Excel/pdf
 * @route   GET /api/reports/export/tasks
 * @access  Private (Admin only)
 */
const exportTasksReport = async (req, res) => {
    try {
        const tasks = await Task.find({}).populate('assignedTo', 'name email').populate('createdBy', 'name email');

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet('Tasks Report');

        worksheet.columns = [
            { header: 'Task ID', key: 'taskId', width: 25 },
            { header: 'Title', key: 'title', width: 30 },
            { header: 'Description', key: 'description', width: 50 },
            { header: 'Priority', key: 'priority', width: 15 },
            { header: 'Status', key: 'status', width: 20 },
            { header: 'Assigned To', key: 'assignedTo', width: 30 },
            { header: 'Created At', key: 'createdAt', width: 20 },
            { header: 'Due Date', key: 'dueDate', width: 20 },
            { header: 'Created By', key: 'createdBy', width: 30 },
        ];

        tasks.forEach((task) => {
            const assignedTo = task.assignedTo
                .map((user) => `${user.name} (${user.email})`)
                .join(', ');
            worksheet.addRow({
                taskId: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                assignedTo: assignedTo || 'Unassigned',
                createdAt: new Date(task.createdAt).toLocaleDateString(),
                dueDate: new Date(task.dueDate).toLocaleDateString(),
                createdBy: `${task.createdBy.name} (${task.createdBy.email})`,
            });
        }); 
        res.setHeader(
            'Content-Type', 
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition', 
            'attachment; filename=tasks_report.xlsx'
        );

        return workbook.xlsx.write(res).then(() => {
            res.status(200).end();
        });
    } 
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

/***
 * @desc    Export all users as Excel/pdf
 * @route   GET /api/reports/export/users
 * @access  Private (Admin only)
 */
const exportUsersReport = async (req, res) => {
    try {
        const  users = await User.find().select('name email _id createdAt').lean();
        const userTasks = await Task.find({}).populate('assignedTo', 'name email _id createdAt');

        const userTaskMap = {};
        users.forEach((user) => {
            userTaskMap[user._id] = {
                name: user.name,
                email: user.email,
                createdAt: new Date(user.createdAt).toLocaleDateString(),
                taskCount: 0,
                pedingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0,
            };
        });

        userTasks.forEach((task) => {
            if (task.assignedTo) {
                task.assignedTo.forEach((assignedUser) => {
                    if (userTaskMap[assignedUser._id]) {
                        userTaskMap[assignedUser._id].taskCount += 1;
                        if (task.status === 'Pending') {
                            userTaskMap[assignedUser._id].pendingTasks += 1;
                        } else if (task.status === 'In Progress') {
                            userTaskMap[assignedUser._id].inProgressTasks += 1;
                        } else if (task.status === 'Completed') {
                            userTaskMap[assignedUser._id].completedTasks += 1;
                        }
                    }
                });
            }
        });

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet('Users Report');

        const columns = [
            { header: 'User ID', key: 'userId', width: 25 },
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Email', key: 'email', width: 40 },
            { header: 'Created At', key: 'createdAt', width: 20 },
            { header: 'Total Assigned Tasks', key: 'taskCount', width: 20 },
            { header: 'Pending Tasks', key: 'pendingTasks', width: 20 },
            { header: 'In Progress Tasks', key: 'inProgressTasks', width: 20 },
            { header: 'Completed Tasks', key: 'completedTasks', width: 20 },
        ];

        Object.values(userTaskMap).forEach((user) => {
            worksheet.addRow(user);
        });

        res.setHeader(
            'Content-Type', 
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition', 
            'attachment; filename=users_report.xlsx'
        );

        return workbook.xlsx.write(res).then(() => {
            res.status(200).end();
        });
    } 
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = {
    exportTasksReport,
    exportUsersReport,
};
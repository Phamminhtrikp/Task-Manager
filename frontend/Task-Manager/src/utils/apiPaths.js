export const BASE_URL = "http://localhost:8000";

// utils/apiPaths.js
export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register", // Register a new user (Admin or member)
        LOGIN: "/api/auth/login", // Authenticate user & return JWT token
        GET_PROFILE: "/api/auth/profile", // Get login user details
    },
    USERS: {
        GET_ALL_USERS: "/api/users", // Get all users (Admin only)
        GET_USER_BY_ID: (userId) => `/api/users/${userId}`, // Get user by id
        CREATE_USER: "/api/users", // Create a new user
        UPDATE_USER: (userId) => `/api/users/${userId}`, // Update user details
        DELETE_USER: (userId) => `/api/users/${userId}`, // Delete a user
    },
    TASKS: {
        GET_DASHBOARD_DATA: "/api/tasks/dashboard-data", // Get dashboard data
        GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data", // Get user dashboard data
        GET_ALL_TASKS: "/api/tasks", // Get all tasks (Admin: all, User: only assigned task)
        GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`, // Get task by id
        CREATE_TASK: "/api/tasks", // Create a new task (Admin only)
        UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`, // Update task details
        DELETE_TASK: (taskId) => `/api/tasks/${taskId}`, // Delete a task (Admin only)

        UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`, // Update task status
        UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`, // Update todo checklist
    },
    REPORTS: {
        EXPORT_TASKS: "/api/reports/export/tasks",
        EXPORT_USERS: "/api/reports/export/users",
    },
    IMAGE: {
        UPLOAD_IMAGE: "/api/auth/upload-imge",
    },
};


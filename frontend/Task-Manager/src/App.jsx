import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router";

import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

import Dashboard from "./pages/Admin/Dashboard";
import ManageTasks from "./pages/Admin/ManageTasks";
import ManageUsers from "./pages/Admin/ManageUsers";
import CreateTask from "./pages/Admin/CreateTask";

import UserDashboard from './pages/User/UserDashboard';
import MyTasks from './pages/User/MyTasks';
import ViewTaskDetails from './pages/User/ViewTaskDetails';


const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />} >
            <Route path='admin/dashboard' element={<Dashboard />} />
            <Route path='admin/tasks' element={<ManageTasks />} />
            <Route path='admin/users' element={<ManageUsers />} />
            <Route path='admin/create-task' element={<CreateTask />} />
          </Route>

          {/* User Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />} >
            <Route path='user/dashboard' element={<UserDashboard />} />
            <Route path='user/tasks' element={<MyTasks />} />
            <Route path='user/task-details/:id' element={<ViewTaskDetails />} />
          </Route>

        </Routes>
      </Router>
    </div>
  )
}

export default App

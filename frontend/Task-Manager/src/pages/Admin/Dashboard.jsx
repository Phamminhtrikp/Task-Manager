import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useUserAuth } from '../../hooks/useUserAuth';
import { UserContext } from '../../context/userContext';
import DashboardLayout from '../../components/layouts/DashboardLayout';


const Dashboard = () => {
  useUserAuth();

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  

  return (
    <DashboardLayout activeMenu="Dashboard">
      
    </DashboardLayout>
  )
}

export default Dashboard;

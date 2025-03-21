import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './components/context/contex';
import { Layout } from 'antd';
import Login from './components/Login/login';
import VerifyEmail from './components/Verify/verify';
import Register from './components/Register/register';
import Home from "./pages/Home/home";
import Scoreboard from "./pages/Scoreboard/scoreboard";
import Teams from "./pages/Teams/teams";
import Team from "./pages/Team/team";
import Settings from "./pages/Settings/settings";
import Notifications from "./pages/notifications/notification";
import Profile from "./pages/Profile/profile";
import Users from "./pages/Users/users";
import Challenges from "./pages/Challenges/challenges";
import Navbar from './components/Navbar/navbar';
import JoinTeam from './pages/Team/jointeam';
import CreateTeam from './pages/Team/createteam';
import UserTeams from "./pages/Team/user-teams";
import AdminPanel from './pages/admin/admin';
import TeamsDetails from "./pages/Teams/TeamsDetails";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');

  // Sayt refresh bo'lganda foydalanuvchi roli va autentifikatsiya holatini tekshirish
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('userRole'); // localStorage dan foydalanuvchi roli
console.log(role);
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    if (role) {
      setUserRole(role); // Foydalanuvchi roli ni o'rnatish
    }
  }, []);

  return (
    <ThemeProvider>
      <Layout style={{ minHeight: '100vh' }}>
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <Layout.Content>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
            <Route path="/admin" element={isAuthenticated && userRole === 'admin' ? <AdminPanel /> : <Navigate to="/login" />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/scoreboard" element={<Scoreboard />} />
            <Route path="/teams" element={<Teams role={userRole} />} />
            <Route path="/teams/:id" element={<TeamsDetails role={userRole} />} />
            <Route path="/team" element={<Team />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/team/join" element={<JoinTeam />} />
            <Route path="/team/create" element={<CreateTeam />} />
            <Route path="/users" element={<Users role={userRole} />} />
            <Route path="/challenges" element={<Challenges role={userRole}/>} />
            <Route path="/teams-user" element={<UserTeams />} />
          </Routes>
        </Layout.Content>
      </Layout>
    </ThemeProvider>
  );
};

export default App;
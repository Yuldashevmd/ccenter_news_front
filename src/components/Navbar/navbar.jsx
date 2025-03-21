import React, { useState } from 'react';
import { Layout, Switch, Select } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalOutlined, BellOutlined, TeamOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import { UserOutlined as UserIcon, TeamOutlined as TeamIcon, TrophyOutlined, FlagOutlined, LoginOutlined, UserAddOutlined, LogoutOutlined, BulbOutlined, BulbFilled } from '@ant-design/icons';

const { Header } = Layout;
const { Option } = Select;

const Navbar = ({ isAuthenticated, setIsAuthenticated, role }) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole('');
  };

  const toggleDarkMode = (checked) => {
    setDarkMode(checked);
    document.body.style.backgroundColor = checked ? '#1e2124' : '#ffffff';
    document.body.style.color = checked ? '#ffffff' : '#000000';
  };

  const handleLanguageChange = (value) => {
    setLanguage(value);
  };

  return (
    <Header style={{ background: darkMode ? '#1e2124' : '#ffffff', position: 'relative', zIndex: 10, padding: '0 150px', borderBottom: darkMode ? '1px solid #333' : '1px solid #ddd' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ color: darkMode ? 'white' : 'black', fontSize: '20px', fontWeight: 'bold', marginRight: '20px' }}>
            Sermikro
          </Link>
          <div style={{ display: 'flex', gap: '20px', marginLeft: '20px' }}>
            <Link to="/users" style={{ color: darkMode ? 'white' : 'black', display: 'flex', alignItems: 'center' }}>
              <UserIcon style={{ marginRight: '5px' }} />
              Users
            </Link>
            <Link to="/teams" style={{ color: darkMode ? 'white' : 'black', display: 'flex', alignItems: 'center' }}>
              <TeamIcon style={{ marginRight: '5px' }} />
              Teams
            </Link>
            <Link to="/scoreboard" style={{ color: darkMode ? 'white' : 'black', display: 'flex', alignItems: 'center' }}>
              <TrophyOutlined style={{ marginRight: '5px' }} />
              Scoreboard
            </Link>
            <Link to="/challenges" style={{ color: darkMode ? 'white' : 'black', display: 'flex', alignItems: 'center' }}>
              <FlagOutlined style={{ marginRight: '5px' }} />
              Challenges
            </Link>
            {/* Admin Panel Link */}
            {role === 'admin' && (
              <Link to="/admin" style={{ color: darkMode ? 'white' : 'black', display: 'flex', alignItems: 'center' }}>
                <SettingOutlined style={{ marginRight: '5px' }} />
                Admin Panel
              </Link>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {isAuthenticated ? (
            <>
              <Link to="/notifications" style={{ color: darkMode ? 'white' : 'black', display: 'flex', alignItems: 'center' }}>
                <BellOutlined style={{ marginRight: '5px' }} />
                Notifications
              </Link>
              <Link to="/profile" style={{ color: darkMode ? 'white' : 'black', display: 'flex', alignItems: 'center' }}>
                <UserOutlined style={{ marginRight: '5px' }} />
                Profile
              </Link>
              <Link to="/settings" style={{ color: darkMode ? 'white' : 'black', display: 'flex', alignItems: 'center' }}>
                <SettingOutlined style={{ marginRight: '5px' }} />
                Settings
              </Link>
              <div onClick={handleLogout} style={{ color: darkMode ? 'white' : 'black', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <LogoutOutlined style={{ marginRight: '5px' }} />
              </div>
            </>
          ) : (
            <>
              <Link to="/register" style={{ color: darkMode ? 'white' : 'black', display: 'flex', alignItems: 'center' }}>
                <UserAddOutlined style={{ marginRight: '5px' }} />
                Register
              </Link>
              <Link to="/login" style={{ color: darkMode ? 'white' : 'black', display: 'flex', alignItems: 'center' }}>
                <LoginOutlined style={{ marginRight: '5px' }} />
                Login
              </Link>
            </>
          )}
          <Select
            defaultValue="English"
            style={{
              width: 120,
              backgroundColor: darkMode ? '#fff' : '#ffffff',
              color: darkMode ? 'white' : 'black'
            }}
            onChange={handleLanguageChange}
            bordered={false}
            suffixIcon={<GlobalOutlined style={{ color: darkMode ? 'black' : 'black' }} />}
            dropdownStyle={{
              backgroundColor: darkMode ? '#1e2124' : '#ffffff',
              color: darkMode ? 'white' : 'black'
            }}
          >
            <Option value="English" style={{ color: darkMode ? 'white' : 'black' }}>English</Option>
            <Option value="pyccкий язык" style={{ color: darkMode ? 'white' : 'black' }}>pyccкий язык</Option>
            <Option value="uzbek" style={{ color: darkMode ? 'white' : 'black' }}>O'zbek</Option>
          </Select>
          <Switch
            checked={darkMode}
            onChange={toggleDarkMode}
            checkedChildren={<BulbFilled style={{ color: darkMode ? '#ffcc00' : '#000' }} />}
            unCheckedChildren={<BulbOutlined style={{ color: darkMode ? '#fff' : '#000' }} />}
          />
        </div>
      </div>
    </Header>
  );
};

export default Navbar;
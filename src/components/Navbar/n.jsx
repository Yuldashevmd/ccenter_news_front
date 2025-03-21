import React, { useState } from 'react';
import { Layout, Menu, Switch, theme } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, TeamOutlined, TrophyOutlined, FlagOutlined, LoginOutlined, UserAddOutlined, LogoutOutlined, BulbOutlined, BulbFilled } from '@ant-design/icons';

const { Header } = Layout;

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);

    const handleLogout = () => {
        setIsAuthenticated(false);
        navigate('/login');
    };

    const toggleDarkMode = (checked) => {
        setDarkMode(checked);
        // Dark/light mode ni amalga oshirish uchun qo'shimcha logika
        document.body.style.backgroundColor = checked ? '#1e2124' : '#ffffff';
        document.body.style.color = checked ? '#ffffff' : '#000000';
    };

    return (
        <Header style={{ background: darkMode ? '#1e2124' : '#ffffff', padding: '0 20px', borderBottom: darkMode ? '1px solid #333' : '1px solid #ddd' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Link to="/" style={{ color: darkMode ? 'white' : 'black', fontSize: '20px', fontWeight: 'bold', marginRight: '20px' }}>
                        Sermikro
                    </Link>
                    <div style={{ display: 'flex', gap: '20px', marginLeft: '20px' }}>
                        <Link to="/users" style={{ color: darkMode ? 'white' : 'black', display: 'flex', alignItems: 'center' }}>
                            <UserOutlined style={{ marginRight: '5px' }} />
                            Users
                        </Link>
                        <Link to="/teams" style={{ color: darkMode ? 'white' : 'black', display: 'flex', alignItems: 'center' }}>
                            <TeamOutlined style={{ marginRight: '5px' }} />
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
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Switch
                        checked={darkMode}
                        onChange={toggleDarkMode}
                        checkedChildren={<BulbFilled style={{ color: darkMode ? '#ffcc00' : '#000' }} />}
                        unCheckedChildren={<BulbOutlined style={{ color: darkMode ? '#fff' : '#000' }} />}
                    />
                    {!isAuthenticated ? (
                        <>
                            <Link to="/register" style={{ color: darkMode ? 'white' : 'black' }}>
                                <UserAddOutlined style={{ marginRight: '5px' }} />
                                Register
                            </Link>
                            <Link to="/login" style={{ color: darkMode ? 'white' : 'black' }}>
                                <LoginOutlined style={{ marginRight: '5px' }} />
                                Login
                            </Link>
                        </>
                    ) : (
                        <div onClick={handleLogout} style={{ color: darkMode ? 'white' : 'black', cursor: 'pointer' }}>
                            <LogoutOutlined style={{ marginRight: '5px' }} />
                            Logout
                        </div>
                    )}
                </div>
            </div>
        </Header>
    );
};

export default Navbar;
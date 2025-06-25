// src/components/Navbar.js
import React from 'react';
import { Layout, Button, Typography, Modal } from 'antd';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { LogoutOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Text } = Typography;

const StyledHeader = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #001529;
  padding: 0 24px;
  height: 64px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 1000;

  @media (max-width: 576px) {
    padding: 0 16px;
    height: 56px;
  }
`;

const WelcomeText = styled(Text)`
  color: #fff;
  font-size: 16px;
  font-weight: 500;

  @media (max-width: 576px) {
    font-size: 14px;
  }
`;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  height: 40px;
  font-size: 14px;

  @media (max-width: 576px) {
    height: 36px;
    font-size: 12px;
    padding: 0 12px;
  }
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    Modal.confirm({
      title: 'Are you sure you want to logout?',
      okText: 'Logout',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        logout();
        navigate('/');
      },
    });
  };

  return (
    <StyledHeader>
      <WelcomeText>Welcome, {user?.name || 'User'}</WelcomeText>
      <StyledButton
        type="primary"
        danger
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        aria-label="Logout"
      >
        Logout
      </StyledButton>
    </StyledHeader>
  );
};

export default Navbar;
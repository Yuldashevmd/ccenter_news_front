import React, { useState } from 'react';
import { Form, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css'; // Yangi CSS faylini import qilamiz

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');


  const onFinish = async (values) => {
    try {
      const response = await axios.post('http://10.15.0.133:7676/v1/auth/login', {
        email: values.email,
        password: values.password,
      });
      if (response.status === 200 || response.status === 201) {
        localStorage.setItem('accessToken', response.data.accessToken);
        setIsAuthenticated(true);
        message.success('Login successful!');
        localStorage.setItem('userRole', response.data.role); // role - foydalanuvchi roli (masalan, 'admin' yoki 'user')
        if (response.data.role === 'admin') {
          setUserRole(response.data.role); // Foydalanuvchi roli
          navigate('/admin');
        } else {
          setUserRole(response.data.role); // Foydalanuvchi roli
          navigate('/');
        }
      } else {
        message.error('Login failed. Please try again.');
      }
    } catch (error) {
      message.error('Login failed. Please check your email and password.');
      console.error('Login error:', error);
    }
  };

  return (
    <section className='section'>
      <div className="login-box">
        <Form name="login" onFinish={onFinish}>
          <h2 className='font-bold text-[28px]'>Login</h2>

          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <div className="input-box">
              <span className="icon"><ion-icon name="mail"></ion-icon> </span>
              <input type="email" autoComplete="off" required />
              <label>Email</label>
            </div>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <div className="input-box">
              <span className="icon"><ion-icon name="lock-closed"></ion-icon></span>
              <input type="password" autoComplete="off" required />
              <label>Password</label>
            </div>
          </Form.Item>

          <div className="remember-forget">
            <label>
              <input type="checkbox" />Remember Me
            </label>
            <a href="#">Forget Password</a>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default Login;
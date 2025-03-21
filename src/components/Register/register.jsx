import React from 'react';
import { Form, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './register.css';

const Register = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const response = await axios.post('http://10.15.0.133:7676/v1/auth/register', {
        email: values.email,
        full_name: values.full_name,
        password: values.password,
        username: values.username,
      });

      if (response.status === 200 || response.status === 201) {
        message.success('Registration successful! Please check your email for the OTP.');
        navigate('/verify-email', { state: { email: values.email } });
      } else {
        message.error('Registration failed. Please try again.');
      }
    } catch (error) {
      message.error('Registration failed. Please try again.');
      console.error('Registration error:', error);
    }
  };

  return (
    <section className='section'>
      <div className="login-box">
        <Form form={form} name="register" onFinish={onFinish}>
          <h2 className='font-bold text-[28px]'>Register</h2>

          {/* Username Input */}
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <div className="input-box">
              <span className="icon"><ion-icon name="person"></ion-icon></span>
              <input type="text" required />
              <label>Username</label>
            </div>
          </Form.Item>

          {/* Full Name Input */}
          <Form.Item
            name="full_name"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <div className="input-box">
              <span className="icon"><ion-icon name="person"></ion-icon></span>
              <input type="text" required />
              <label>Full Name</label>
            </div>
          </Form.Item>

          {/* Email Input */}
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <div className="input-box">
              <span className="icon"><ion-icon name="mail"></ion-icon></span>
              <input type="email" required />
              <label>Email</label>
            </div>
          </Form.Item>

          {/* Password Input */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <div className="input-box">
              <span className="icon"><ion-icon name="lock-closed"></ion-icon></span>
              <input type="password" required />
              <label>Password</label>
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default Register;
import React from 'react';
import { Form, Input, Button, Typography, Card } from 'antd';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const AuthForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const onLogin = async (values) => {
    const success = await login(values.email, values.password);
    if (success) {
      navigate('/todos');
    }
  };

  return (
    <Card style={{ width: 400, margin: '100px auto', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <Title level={3} style={{ textAlign: 'center', color: '#1f2937' }}>
        Login
      </Title>
      <Form name="login" onFinish={onLogin} layout="vertical">
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input className="rounded-lg" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password className="rounded-lg" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            className="bg-gradient-to-r from-blue-600 hover:from-blue-700 to-blue-800 hover:to-blue-900 rounded-lg"
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AuthForm;
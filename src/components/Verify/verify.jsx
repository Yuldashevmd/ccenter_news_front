import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const onFinish = async (values) => {
    try {
      const response = await axios.post('http://10.15.0.133:7676/v1/auth/verify-email', {
        email: email,
        otp: values.otp,
      });

      if (response.status === 200) {
        message.success('Email verified successfully! Please login.');
        navigate('/login');
      }
    } catch (error) {
      message.error('Email verification failed. Please try again.');
      console.error('Verification error:', error);
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen section">
      <div className="shadow-lg p-8 rounded-lg w-full max-w-md login-box">
        <Form name="verify-email" onFinish={onFinish}>
          <h2 className="mb-6 font-bold text-white text-2xl text-center">Verify Email</h2>

          {/* Email Input (Read-only and Disabled) */}
          <Form.Item>
            <div className="relative mb-6">
              <Input
                value={email}
                readOnly
                disabled
                className="bg-transparent hover:bg-transparent py-2 pr-4 pl-10 border-gray-400 border-b focus:border-blue-500 focus:outline-none w-full text-white placeholder-gray-400"
                style={{ color: 'white', backgroundColor: 'transparent' }} // Ensure text color and background
              />
            </div>
          </Form.Item>

          {/* OTP Input */}
          <Form.Item
            name="otp"
            rules={[{ required: true, message: 'Please input the OTP!' }]}
          >
            <div className="relative mb-6">
              <span className="top-1/2 left-3 absolute text-white -translate-y-1/2 transform">
                <ion-icon name="lock-closed"></ion-icon>
              </span>
              <Input
                placeholder="Enter the OTP sent to your email"
                className="bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent py-2 pr-4 pl-10 border-gray-400 border-b focus:border-blue-500 focus:outline-none w-full text-white placeholder-gray-400"
              />
            </div>
          </Form.Item>

          {/* Verify Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded focus:shadow-outline focus:outline-none w-full font-bold text-white"
            >
              Verify
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default VerifyEmail;
import React from 'react';
import { Form, Input, Button, notification } from 'antd';
import translations from '../../locales/translations.json';

const Login = ({ setIsAuthenticated, lang }) => {
  const onFinish = (values) => {
    if (values.username === 'admin' && values.password === 'password') {
      setIsAuthenticated(true);
      notification.success({
        message: translations[lang].login.success,
        description: translations[lang].login.welcome,
      });
    } else {
      notification.error({
        message: translations[lang].login.error,
        description: translations[lang].login.invalid,
      });
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 h-screen">
      <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md">
        <h2 className="mb-6 font-bold text-2xl text-center">{translations[lang].login.title}</h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={translations[lang].login.username}
            name="username"
            rules={[{ required: true, message: translations[lang].login.usernameRequired }]}
          >
            <Input placeholder={translations[lang].login.usernamePlaceholder} />
          </Form.Item>
          <Form.Item
            label={translations[lang].login.password}
            name="password"
            rules={[{ required: true, message: translations[lang].login.passwordRequired }]}
          >
            <Input.Password placeholder={translations[lang].login.passwordPlaceholder} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {translations[lang].login.login}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
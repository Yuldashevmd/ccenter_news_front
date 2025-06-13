// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import AuthForm from './components/AuthForm';
import TodoList from './components/todolist';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

const AppLayout = () => {
  const { user } = useAuth();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {user && <Navbar />}
      <Content style={{ padding: '24px' }}>
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route
            path="/todos"
            element={user ? <TodoList /> : <Navigate to="/" />}
          />
        </Routes>
      </Content>
    </Layout>
  );
};

const App = () => {
  return (
    <AuthProvider>
        <AppLayout />
    </AuthProvider>
  );
};

export default App;
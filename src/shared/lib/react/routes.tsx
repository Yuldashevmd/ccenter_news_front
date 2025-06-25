import { DashboardPage } from 'pages/dashboard';
import { LoginPage } from 'pages/login';
import { createBrowserRouter } from 'react-router-dom';
import { AuthGuard } from 'shared/services';
import { Header } from 'widgets/header';

export const routes = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthGuard>
        <Header />
        <DashboardPage />
      </AuthGuard>
    ),
  },
  {
    path: '/login',
    element: <LoginPage />,
  }
]);

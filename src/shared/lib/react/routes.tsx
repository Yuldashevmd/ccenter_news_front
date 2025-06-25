import { DashboardPage } from 'pages/dashboard';
import { LoginPage } from 'pages/login';
import { createBrowserRouter } from 'react-router-dom';
import { AuthGuard } from 'shared/services';

export const routes = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthGuard>
        <DashboardPage />
      </AuthGuard>
    ),
  },
  {
    path: '/login',
    element: <LoginPage />,
  }
]);

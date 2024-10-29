import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { SigninPage } from './pages/Auth.page';
import { DashboardPage } from './pages/Dashboard.page';
import { HistoryPage } from './pages/History.page';
import { HomePage } from './pages/Home.page';
import { PaymentSuccessPage } from './pages/PaymentSuccess.page';
import { ProfilePage } from './pages/Profile.page';
import { SubscriptionPage } from './pages/Subscription.page';
import { VerifyLoginPage } from './pages/VerifyLogin.page';
import { useUserStore } from './store/user';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuth = useUserStore((state) => state.isLoggedIn);
  return isAuth ? children : <Navigate to="/auth" replace />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/auth',
    element: <SigninPage />,
  },
  {
    path: '/verify-login',
    element: <VerifyLoginPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/history',
    element: (
      <ProtectedRoute>
        <HistoryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/subscription',
    element: (
      <ProtectedRoute>
        <SubscriptionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/subscription/success',
    element: (
      <ProtectedRoute>
        <PaymentSuccessPage />
      </ProtectedRoute>
    ),
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}

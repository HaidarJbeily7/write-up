import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AnswerPage } from './pages/Answer.page';
import { SigninPage } from './pages/Auth.page';
import { DashboardPage } from './pages/Dashboard.page';
import { HistoryPage } from './pages/History.page';
import { HomePage } from './pages/Home.page';
import { PaymentSuccessPage } from './pages/PaymentSuccess.page';
import { ProfilePage } from './pages/Profile.page';
import { ProfileEditPage } from './pages/ProfileEdit.page';
import { ResultPage } from './pages/Result.page';
import { SubscriptionPage } from './pages/Subscription.page';
import { TopicsPage } from './pages/Topics.page';
import { VerifyLoginPage } from './pages/VerifyLogin.page';
import { useUserStore } from './store/user';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuth = useUserStore((state) => state.isLoggedIn);
  const isActive = useUserStore((state) => state.user.isActive);
  if (!isAuth) {
    return <Navigate to="/auth" replace />;
  }
  if (!isActive) {
    return <Navigate to="/profile/edit" replace />;
  }
  return children;
};

const ProfileEditRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuth = useUserStore((state) => state.isLoggedIn);
  if (!isAuth) {
    return <Navigate to="/auth" replace />;
  }
  return children;
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
    path: '/topics',
    element: (
      <ProtectedRoute>
        <TopicsPage />
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
    path: '/answer',
    element: (
      <ProtectedRoute>
        <AnswerPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/result',
    element: (
      <ProtectedRoute>
        <ResultPage />
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
    path: '/profile/edit',
    element: (
      <ProfileEditRoute>
        <ProfileEditPage />
      </ProfileEditRoute>
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

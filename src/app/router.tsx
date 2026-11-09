import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '@/app/AppLayout';
import RequireAuth from '@/app/RequireAuth';
import RequireAdmin from '@/app/RequireAdmin';
import HomePage from '@/features/home/pages/HomePage';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage';
import ChatPage from '@/features/chat/pages/ChatPage';
import ProfilePage from '@/features/profile/pages/ProfilePage';
import AdminPage from '@/features/admin/pages/AdminPage';
import GoodPracticesPage from '@/features/guidance/pages/GoodPracticesPage';
import HelpPage from '@/features/help/pages/HelpPage';

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/chat/:conversationId?', element: <ChatPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/good-practices', element: <GoodPracticesPage /> },
          { path: '/help', element: <HelpPage /> },
          {
            element: <RequireAdmin />,
            children: [{ path: '/admin', element: <AdminPage /> }],
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '@/app/AppLayout';
import RequireAuth from '@/app/RequireAuth';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import ChatPage from '@/features/chat/pages/ChatPage';
import ProfilePage from '@/features/profile/pages/ProfilePage';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/chat" replace /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/chat/:conversationId?', element: <ChatPage /> },
          { path: '/profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/chat" replace /> },
]);

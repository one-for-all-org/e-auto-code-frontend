import { RouterProvider } from 'react-router-dom';
import { AppProviders } from '@/app/providers';
import { router } from '@/app/router';
import { HealthChecker } from '@/components/ui/HealthChecker';

export default function App() {
  return (
    <AppProviders>
      <HealthChecker />
      <RouterProvider router={router} />
    </AppProviders>
  );
}

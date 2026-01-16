// src/pages/ProtectedLayout.tsx
import { Outlet } from 'react-router-dom';
import ProtectedRouter from './ProtectedRouter'; // Same folder, relative import
import {ModernLayout} from '@/components/ModernLayout';

const ProtectedLayout = () => {
  return (
    <ProtectedRouter>
      <ModernLayout>
        <Outlet />
      </ModernLayout>
    </ProtectedRouter>
  );
};

export default ProtectedLayout;
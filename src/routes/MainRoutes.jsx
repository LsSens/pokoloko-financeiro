import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from './ProtectedRoute';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));

// utilities routing
const UtilsSettings = Loadable(lazy(() => import('views/utilities/Settings')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Finances')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <ProtectedRoute element={<DashboardDefault />} />
        },
        {
            path: 'configuracoes',
            element: <ProtectedRoute element={<UtilsSettings />} />
        },
        {
            path: 'Fechamentos',
            element: <ProtectedRoute element={<UtilsColor />} />
        }
    ]
};

export default MainRoutes;

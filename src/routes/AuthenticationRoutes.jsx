import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import RedirectIfAuthenticated from './RedirectIfAuthenticated';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication3/Login3')));
const AuthForgot = Loadable(lazy(() => import('views/pages/authentication3/Forgot')));
const Logout3 = Loadable(lazy(() => import('views/pages/authentication3/Logout3')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '/login/',
            element: <RedirectIfAuthenticated element={<AuthLogin3 />} />
        },
        {
            path: '/forgot',
            element: <RedirectIfAuthenticated element={<AuthForgot />} />
        },
        {
            path: '/logout',
            element: <Logout3 />
        }
    ]
};

export default AuthenticationRoutes;

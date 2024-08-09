import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        logout();
        navigate('/login');
        window.location.reload();
    }, [logout, navigate]);

    return null;
};

export default Logout;

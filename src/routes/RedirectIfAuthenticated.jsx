/* eslint-disable react/prop-types */
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RedirectIfAuthenticated = ({ element }) => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return element;
};

export default RedirectIfAuthenticated;

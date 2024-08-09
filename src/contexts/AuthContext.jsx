/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUser, fetchData, fetchFechamentos } from '../store/actions/dataActions';
import Loader from 'ui-component/Loader';

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const dispatch = useDispatch();

    const updateData = async () => {
        try {
            await dispatch(fetchUser());
            await dispatch(fetchData());
            await dispatch(fetchFechamentos());
        } catch (error) {
            console.error('Failed to update data:', error);
            logout();
        }
    };

    const verifyToken = async (token) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/protected`, {
                method: 'GET',
                headers: {
                    'x-access-token': token
                }
            });

            if (response.ok) {
                setIsAuthenticated(true);
                login({ token });
                await updateData();
            } else {
                setIsAuthenticated(false);
                localStorage.removeItem('authToken');
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            setIsAuthenticated(false);
            localStorage.removeItem('authToken');
        } finally {
            setIsInitialized(true);
        }
    };

    useEffect(() => {
        const savedToken = localStorage.getItem('authToken');
        if (savedToken) {
            setToken(savedToken);
            verifyToken(savedToken);
        } else {
            setIsInitialized(true);
        }
    }, []);

    const login = ({ token }) => {
        localStorage.setItem('authToken', token);
        setToken(token);
        setIsAuthenticated(true);
        updateData();
    };

    const logout = () => {
        setToken(null);
        setIsAuthenticated(false);
        setIsInitialized(false);
        localStorage.removeItem('authToken');
    };

    if (!isInitialized) {
        return <Loader />;
    }

    return <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState, useEffect } from 'react';

// Criação do contexto
const DataContext = createContext();

// Criação do provedor de contexto
export const DataProvider = ({ children }) => {
    const [targetYear, setTargetYear] = useState(null);
    const [targetMonth, setTargetMonth] = useState(null);
    const [allData, setAllData] = useState([]);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    const token = localStorage.getItem('authToken');

    // Funções para buscar dados do backend
    const fetchUser = async () => {
        try {
            const responseUser = await fetch(`${import.meta.env.VITE_API_BASE_URL}/me`, {
                headers: {
                    'x-access-token': token
                }
            });

            if (responseUser.status === 401) {
                setError('Sessão expirada. Por favor, faça login novamente.');
                window.location.reload();
                return;
            }

            if (!responseUser.ok) {
                throw new Error(`HTTP error Status: ${responseUser.status}`);
            }

            const userData = await responseUser.json();
            setUser(userData);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchData = async () => {
        try {
            const responseSelecionado = await fetch(`${import.meta.env.VITE_API_BASE_URL}/selecionado`, {
                headers: {
                    'x-access-token': token
                }
            });
            if (!responseSelecionado.ok) {
                throw new Error(`HTTP error Status: ${responseSelecionado.status}`);
            }
            const dataSelecionado = await responseSelecionado.json();
            if (dataSelecionado.length > 0) {
                setTargetYear(dataSelecionado[0].ano);
                setTargetMonth(dataSelecionado[0].mes);
            } else {
                throw new Error('Dados de selecionado estão vazios');
            }
        } catch (error) {
            setError(error);
        }
    };

    const fetchFechamentos = async () => {
        try {
            const responseFechamentos = await fetch(`${import.meta.env.VITE_API_BASE_URL}/fechamentos`, {
                headers: {
                    'x-access-token': token
                }
            });
            if (!responseFechamentos.ok) {
                throw new Error(`HTTP error Status: ${responseFechamentos.status}`);
            }
            const dataFechamentos = await responseFechamentos.json();
            setAllData(dataFechamentos);
        } catch (error) {
            setError(error);
        }
    };

    // Fetch inicial dos dados
    useEffect(() => {
        if (token) {
            fetchUser();
            fetchData();
            fetchFechamentos();
        }
    }, [token]);

    // Dados e funções para exportar
    return (
        <DataContext.Provider value={{ targetYear, targetMonth, allData, error, user, fetchUser, fetchData, fetchFechamentos }}>
            {children}
        </DataContext.Provider>
    );
};

// Custom hook para usar o contexto
export const useData = () => {
    return useContext(DataContext);
};

export default DataContext;

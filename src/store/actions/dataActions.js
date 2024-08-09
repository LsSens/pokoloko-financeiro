import { SET_TARGET_YEAR, SET_TARGET_MONTH, SET_ALL_DATA, SET_SELECT_DATA, SET_USER, SET_ERROR } from './types';

export const setTargetYear = (year) => ({
    type: SET_TARGET_YEAR,
    payload: year
});

export const setTargetMonth = (month) => ({
    type: SET_TARGET_MONTH,
    payload: month
});

export const setAllData = (data) => ({
    type: SET_ALL_DATA,
    payload: data
});

export const setSelectData = (selectData) => ({
    type: SET_SELECT_DATA,
    payload: selectData
});

export const setUser = (user) => ({
    type: SET_USER,
    payload: user
});

export const setError = (error) => ({
    type: SET_ERROR,
    payload: error
});

export const fetchUser = () => async (dispatch) => {
    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/me`, {
            headers: {
                'x-access-token': token
            }
        });

        if (response.status === 401) {
            dispatch(setError('Sessão expirada. Por favor, faça login novamente.'));
            window.location.reload();
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP error Status: ${response.status}`);
        }

        const userData = await response.json();
        dispatch(setUser(userData));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const fetchData = () => async (dispatch) => {
    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/selecionado`, {
            headers: {
                'x-access-token': token
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error Status: ${response.status}`);
        }

        const dataSelecionado = await response.json();
        if (dataSelecionado.length > 0) {
            dispatch(setTargetYear(dataSelecionado[0].ano));
            dispatch(setTargetMonth(dataSelecionado[0].mes));
        } else {
            dispatch(setError('Dados de selecionado estão vazios'));
        }
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const fetchFechamentos = () => async (dispatch, getState) => {
    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/fechamentos`, {
            headers: {
                'x-access-token': token
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error Status: ${response.status}`);
        }

        const dataFechamentos = await response.json();
        dispatch(setAllData(dataFechamentos));
        const { targetYear, targetMonth } = getState().data;

        const selectedData = dataFechamentos.find((item) => item.ano === targetYear && item.mes === targetMonth);
        if (selectedData) {
            setTimeout(dispatch(setSelectData(selectedData)), 1000);
        } else {
            dispatch(setSelectData(null));
        }
    } catch (error) {
        dispatch(setError(error.message));
    }
};

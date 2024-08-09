// Importar as ações necessárias
import { fetchUser, fetchData, fetchFechamentos } from '../store/actions/dataActions';

export async function putRequest(url, data, dispatch) {
    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = '/logout';
            }
            throw new Error(`HTTP error Status: ${response.status}`);
        }

        const responseData = await response.json();

        dispatch(fetchUser());
        dispatch(fetchData());
        dispatch(fetchFechamentos());

        return responseData;
    } catch (error) {
        console.error('Erro ao fazer requisição:', error.message);
        throw error;
    }
}

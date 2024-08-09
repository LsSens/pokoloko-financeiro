import axios from 'axios';

const login = async (email, password) => {
    const response = await axios.post('https://api-pokoloko.vercel.app/api/login', { email, password });
    return response.data;
};

const logout = () => {
    localStorage.removeItem('authToken');
};

export default { login, logout };

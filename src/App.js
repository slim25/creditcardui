import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import AddCard from './components/AddCard';
import CardList from './components/CardList';

function App() {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
    const [cards, setCards] = useState([]);

    const setTokens = (access, refresh) => {
        setAccessToken(access);
        setRefreshToken(refresh);
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        delete axios.defaults.headers.common['Authorization'];
        window.location.href = '/login';
    };

    const refreshAccessToken = async (token) => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/refresh-token', { refreshToken: token });
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

            setTokens(newAccessToken, newRefreshToken);

            return newAccessToken;
        } catch (error) {
            console.error("Failed to refresh token", error);
            handleLogout();
            return null;
        }
    };

    const fetchCards = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/credit-cards');
            setCards(response.data);
        } catch (error) {
            console.error("Error fetching cards:", error);
        }
    };

    // Axios interceptor for refreshing token
    axios.interceptors.response.use(
        response => response,
        async (error) => {
            const originalRequest = error.config;

            if (!error.response) {
                console.error("Network error: Unable to reach the server");
                alert("Network error: Please check your server or CORS configuration.");
                return Promise.reject(error);
            }

            if (error.response.data?.error === "refresh_token_expired") {
                handleLogout();
                alert("Your session has expired. Please log in again.");
                return Promise.reject(new Error("Session expired. Please log in again."));
            }

            if ((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
                originalRequest._retry = true;
                const token = localStorage.getItem('refreshToken');
                const newAccessToken = await refreshAccessToken(token);

                if (newAccessToken) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axios(originalRequest);
                }
            }

            return Promise.reject(error);
        }
    );

    useEffect(() => {
        if (accessToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            fetchCards();
        }
    }, [accessToken]);

    const handleCardAdded = (newCard) => {
        setCards([...cards, newCard]);
    };

    return (
        <div className="App">
            <h1>Credit Card Management System</h1>

            {!accessToken ? (
                <Login setTokens={setTokens} />
            ) : (
                <>
                    <button onClick={handleLogout}>Logout</button>
                    <AddCard accessToken={accessToken} onCardAdded={handleCardAdded} />
                    <CardList cards={cards} />
                </>
            )}
        </div>
    );
}

export default App;

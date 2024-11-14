import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import RegisterForm from './components/RegisterForm';
import AddCard from './components/AddCard';
import CardList from './components/CardList';
import AdminView from './components/AdminView';
import UserProfileForm from './components/UserProfileForm';

function App() {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
    const [cards, setCards] = useState([]);
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'ROLE_USER');
    const [isRegistering, setIsRegistering] = useState(false);

    const setTokens = (access, refresh, role) => {
        setAccessToken(access);
        setRefreshToken(refresh);
        setUserRole(role);
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        localStorage.setItem('userRole', role);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    };

    const handleLogout = () => {
        localStorage.clear();
        delete axios.defaults.headers.common['Authorization'];
        window.location.href = '/';
    };

    const refreshAccessToken = async (token) => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/refresh-token', { refreshToken: token });
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
            setTokens(newAccessToken, newRefreshToken, userRole);
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

    axios.interceptors.response.use(
        response => response,
        async (error) => {
            const originalRequest = error.config;

            if (!error.response) {
                console.error("Network error: Unable to reach the server");
                return Promise.reject(error);
            }

            if (error.response.data === "refresh_token_expired") {
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

    const handleCardAdded = (newCard) => setCards([...cards, newCard]);

    return (
        <div className="App">
            <h1>Credit Card Management System</h1>
            {!accessToken ? (
                isRegistering ? (
                    <RegisterForm onRegisterSuccess={() => setIsRegistering(false)} />
                ) : (
                    <>
                        <Login setTokens={setTokens} />
                        <p>
                            Don't have an account? <button onClick={() => setIsRegistering(true)}>Register</button>
                        </p>
                    </>
                )
            ) : (
                <>
                    <button onClick={handleLogout}>Logout</button>
                    {userRole === 'ROLE_ADMIN' ? (
                        <AdminView />
                    ) : (
                        <>
                            <UserProfileForm />
                            <AddCard accessToken={accessToken} onCardAdded={handleCardAdded} />
                            <CardList cards={cards} />
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default App;

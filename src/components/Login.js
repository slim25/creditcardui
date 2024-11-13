import React, { useState } from 'react';
import axios from 'axios';

function Login({ setTokens }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', { username, password });
            const { accessToken, refreshToken, role } = response.data;
            setTokens(accessToken, refreshToken, role);
        } catch (error) {
            console.error("Login failed", error);
            alert("Login failed. Please check your credentials and try again.");
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
    );
}

export default Login;

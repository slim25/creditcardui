import React, { useState } from 'react';
import axios from 'axios';

function RegisterForm({ onRegisterSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('ROLE_USER');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                username,
                password,
                roles: [role]
            });
            alert("Registration successful!");
            onRegisterSuccess();
        } catch (error) {
            console.error("Registration failed", error);
            alert(error.response.data);
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <h2>Register</h2>
            <div>
                <label>Username:</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div>
                <label>Role:</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="ROLE_USER">User</option>
                    <option value="ROLE_ADMIN">Admin</option>
                </select>
            </div>
            <button type="submit">Register</button>
        </form>
    );
}

export default RegisterForm;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserProfileForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/user-profiles', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
                });
                const { name, email, phone } = response.data;
                setName(name || '');
                setEmail(email || '');
                setPhone(phone || '');
                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile", error);
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                'http://localhost:8080/api/user-profiles',
                { name, email, phone },
                { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
            );
            alert("Profile saved successfully!");
        } catch (error) {
            console.error("Error saving profile", error);
            alert("Failed to save profile. Please try again.");
        }
    };

    if (loading) {
        return <p>Loading profile...</p>;
    }

    return (
        <form onSubmit={handleSaveProfile}>
            <h2>User Profile</h2>
            <div>
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <label>Phone:</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <button type="submit">Save Profile</button>
        </form>
    );
}

export default UserProfileForm;

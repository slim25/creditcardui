import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminView() {
    const [userProfiles, setUserProfiles] = useState([]);
    const [activityLogs, setActivityLogs] = useState({});
    const [activityLimit, setActivityLimit] = useState(20);

    useEffect(() => {
        const fetchUserProfiles = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/user-profiles/admin/all', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
                });
                setUserProfiles(response.data);
            } catch (error) {
                console.error("Error fetching user profiles", error);
            }
        };
        fetchUserProfiles();
    }, []);

    const handleDeleteCard = async (cardToken, userId) => {
        try {
            await axios.delete('http://localhost:8080/api/credit-cards', {
                            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                            data: { token: cardToken, userId: userId }
                        });
            setUserProfiles(userProfiles.map(profile => ({
                ...profile,
                creditCards: profile.creditCards.filter(card => card.cardToken !== cardToken)
            })));

            alert("Credit card removed successfully!");
        } catch (error) {
            console.error("Error deleting card:", error);
        }
    };

    const fetchActivityLogs = async (userId, activityLimit) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/admin/activity-logs/user/${userId}/${activityLimit}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            setActivityLogs((prevLogs) => ({ ...prevLogs, [userId]: response.data }));
        } catch (error) {
            console.error("Error fetching activity logs", error);
        }
    };

    return (
        <div>
                    <h2>All User Profiles with Credit Cards and Activity Logs</h2>
                    {userProfiles.map(profile => (
                        <div key={profile.userProfile.id}>
                            <h3>{profile.userProfile.name} - {profile.userProfile.email}</h3>
                            <p>Phone: {profile.userProfile.phone}</p>
                            <h4>Credit Cards:</h4>
                            <ul>
                                {profile.creditCards.map(card => (
                                    <li key={card.cardToken}>
                                        {card.cardHolderName} - {card.maskedCardNumber}
                                        <button onClick={() => handleDeleteCard(card.cardToken, profile.userProfile.userId)}>Delete</button>
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => fetchActivityLogs(profile.userProfile.userId, activityLimit)}>
                                Show Last {activityLimit} Activities
                            </button>
                            {activityLogs[profile.userProfile.userId] && (
                                <div>
                                    <h4>Recent Activity Logs:</h4>
                                    <ul>
                                        {activityLogs[profile.userProfile.userId].map(log => (
                                            <li key={log.id}>
                                                <strong>{log.activityType}</strong> at {new Date(log.timestamp).toLocaleString()}
                                                <br />
                                                Details: {log.details}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <hr />
                        </div>
                    ))}
                </div>
    );
}

export default AdminView;

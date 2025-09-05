import React, { useState, useEffect } from 'react';
import '../../styles/profile.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = ({ SERVER_URL }) => {
    const { id } = useParams();
    const [partner, setPartner] = useState(null);
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        axios.get(`${SERVER_URL}/api/food-partner/${id}`,{withCredentials:true})
          .then(res => {
            setPartner(res.data.foodPartner)
            setVideos(res.data.foodPartner.foodItems)
          })
          .catch(err => {
            // Handle error appropriately
          });
    }, [id]);

    if (!partner) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <header className="profile-header">
                <div className="profile-avatar">
                    <img src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg" alt="profile image" />
                </div>
                <div className="profile-info">
                    <h1 className="business-name">{partner.name}</h1>
                    <p className="address">{partner.address}</p>
                </div>
                <div className="profile-stats">
                    <div>
                        <span className="stat-value">{videos.length}</span>
                        <span className="stat-label">Total Meals</span>
                    </div>
                    <div>
                        <span className="stat-value">15K</span>
                        <span className="stat-label">Customers Served</span>
                    </div>
                </div>
            </header>

            <main className="profile-videos">
                {videos.map(video => (
                    <div key={video._id} className="video-item">
                        <video src={video.video} muted loop playsInline />
                    </div>
                ))}
            </main>
        </div>
    );
}

export default Profile;
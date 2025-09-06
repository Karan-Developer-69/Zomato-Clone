import React, { useState, useRef } from 'react';
import '../../styles/createFood.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const CreateFood = ({ SERVER_URL }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { cookies } = useAuth();
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (videoRef.current.files[0]) {
      formData.append('video', videoRef.current.files[0]);
    }
    formData.append('token', cookies.token);

const response = await axios.post(
  `${SERVER_URL}/api/food`,
  formData,
  {
    headers: { 'Content-Type': 'multipart/form-data' },
  }
);
    
    setName('');
    setDescription(''); 
    if (videoRef.current) {
      videoRef.current.value = null;
    }
    navigate('/');
  };

  return (
    <div className="create-food-container">
      <div className="form-wrapper">
        <h2>Add New Food Item</h2>
        <form className="food-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Food Name</label>
            <input 
              type="text" 
              id="name"
              name="name"
              placeholder="Enter food item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="video">Food Video</label>
            <input 
              type="file"
              id="video"
              name="video"
              accept="video/*"
              ref={videoRef}
              required
              className="file-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea 
              id="description"
              name="description"
              placeholder="Enter food description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <button type="submit" onClick={handleSubmit} className="submit-btn">
            Add Food Item
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateFood;
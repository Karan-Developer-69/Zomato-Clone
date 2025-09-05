import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBookmark, FaHome } from 'react-icons/fa';
import axios from 'axios';
import Reel from '../../components/Reel';
import '../../styles/reels.css';

const Saved = ({ SERVER_URL }) => {
    const [videos, setVideos] = useState([]);
    const videoRefs = useRef([]);
    const reelRefs = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();

    // Reset refs on render
    const resetRefs = () => {
        videoRefs.current = [];
        reelRefs.current = [];
    };
    resetRefs();

    const setVideoRef = (el) => {
        if (el) {
            videoRefs.current.push(el);
        }
    };

    const setReelRef = (el) => {
        if (el) {
            reelRefs.current.push(el);
        }
    };

    // Toggle play/pause
    const handleVideoToggle = useCallback((idx) => {
        const video = videoRefs.current[idx];
        if (!video) return;
        
        if (video.paused) {
            video.play().catch(() => {});
            video.dataset.playing = '1';
        } else {
            video.pause();
            video.dataset.playing = '0';
        }
    }, []);

    // Fetch saved videos
    useEffect(() => {
        axios.get(`${SERVER_URL}/api/food/save`, { withCredentials: true })
            .then((res) => {
                setVideos(res.data.savedFoods.map(item => item.food));
            })
            .catch((err) => {
                console.error('Error fetching saved videos:', err.message);
            });
    }, []);

    // Video intersection observer
    useEffect(() => {
        if (videos.length === 0 || reelRefs.current.length === 0) return;

        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.55,
        };

        const onIntersect = (entries) => {
            entries.forEach((entry) => {
                const index = parseInt(entry.target.dataset.index);
                const video = videoRefs.current[index];
                if (!video) return;

                if (entry.isIntersecting) {
                    video.muted = true;
                    video.play().catch(() => {});
                    video.dataset.playing = '1';
                } else {
                    video.pause();
                    video.dataset.playing = '0';
                }
            });
        };

        const observer = new IntersectionObserver(onIntersect, options);
        reelRefs.current.forEach((ref) => observer.observe(ref));

        return () => observer.disconnect();
    }, [videos]);

    const handleLike = async (videoToLike) => {
        const response = await axios.post(`${SERVER_URL}/api/food/like`, {foodId: videoToLike._id
        }, { withCredentials: true });
        if(response.data.like){
            setVideos((prevVideos) =>
                prevVideos.map((v) =>
                    // The issue was here: The parameter for map was 'video', which shadowed the 'video' from handleLike.
                    // This caused `video._id === video._id` to always be true, updating all videos.
                    // By using a different name for the video being liked (`videoToLike`), we can correctly compare the IDs.
                    v._id === videoToLike._id
                        ? { ...v, likeCount: (v.likeCount || 0) + 1 }
                        : v
                )
            );
        } else {
            setVideos((prevVideos) =>
                prevVideos.map((v) =>
                    v._id === videoToLike._id
                        ? { ...v, likeCount: Math.max((v.likeCount || 1) - 1, 0) }
                        : v
                )
            );
        }
    };

    const handleUnsave = async (video) => {
        try {
            const response = await axios.post(`${SERVER_URL}/api/food/save`, { foodId: video._id }, { withCredentials: true });
            // If the video is no longer saved, filter it out of the state.
            if (!response.data.save) {
                setVideos((prevVideos) => prevVideos.filter((v) => v._id !== video._id));
            }
        } catch (error) {
            console.error('Error unsaving video:', error);
        }
    };

    if (videos.length === 0) {
        return (
                <>
        <div className="empty-saved">
                <h2>No saved videos yet</h2>
                <p>Videos you save will appear here</p>
            </div>
            {/* Bottom Navigation - Keep only Home and Saved */}
            <nav className="bottom-nav">
                <button
                    className={`nav-btn ${
                        location.pathname === "/" ? "active" : ""
                    }`}
                    onClick={() => navigate("/")}
                >
                    <FaHome />
                    <span>Home</span>
                </button>

                <button
                    className={`nav-btn ${
                        location.pathname === "/saved" ? "active" : ""
                    }`}
                    onClick={() => navigate("/saved")}
                >
                    <FaBookmark />
                    <span>Saved</span>
                </button>
            </nav>

        </>
        );
    }

    return (
        <div className="saved-container">
            <div className="reels-container" role="list">
                {videos.map((v, i) => (
                    <Reel
                        key={v._id}
                        video={v}
                        index={i}
                        setReelRef={setReelRef}
                        setVideoRef={setVideoRef}
                        handleVideoToggle={handleVideoToggle}
                        handleLike={handleLike}
                        handleSave={handleUnsave}
                        isSavedPage={true}
                    />
                ))}
                
            </div>

            <nav className="bottom-nav">
                <button
                    className={`nav-btn ${location.pathname === "/" ? "active" : ""}`}
                    onClick={() => navigate("/")}
                >
                    <FaHome />
                    <span>Home</span>
                </button>

                <button
                    className={`nav-btn ${location.pathname === "/saved" ? "active" : ""}`}
                    onClick={() => navigate("/saved")}
                >
                    <FaBookmark />
                    <span>Saved</span>
                </button>
            </nav>
        </div>
    );
};

export default Saved;

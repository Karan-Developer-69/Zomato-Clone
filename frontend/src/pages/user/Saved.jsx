import { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaBookmark } from 'react-icons/fa';
import "../../styles/reels.css"
import Reel from '../../components/Reel';


const Saved = ({SERVER_URL}) => {
    const [videos, setVideos] = useState([]);
    const [cookies] = useCookies(['token']);
    const navigate = useNavigate();
    const location = useLocation();

    const videoRefs = useRef([]);
    const reelRefs = useRef([]);

    const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null);


    const setVideoRef = useCallback((el, index) => {
        if (el) {
            videoRefs.current[index] = el;
        }
    }, []);

    const setReelRef = useCallback((el, index) => {
        if (el) {
            reelRefs.current[index] = el;
        }
    }, []);

    // Fetch saved videos
    useEffect(() => {
        axios.get(`${SERVER_URL}/api/food/save`, { headers: { 'Authorization': `Bearer ${cookies.token}` } })
            .then((res) => {
                setVideos(res.data.savedFoods.map(item => ({...item.food, isSavedByUser: true}))); // Mark as saved
            })
            .catch((err) => {
                console.error('Error fetching saved videos:', err.message);
                if (err.response && err.response.status === 401) {
                    navigate('/login');
                }
            });
    }, [cookies.token, navigate]);

    // Intersection Observer for autoplay/pause
    useEffect(() => {
        if (videos.length === 0 || reelRefs.current.length === 0) return;

        const options = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.75, // When 75% of the reel is visible
        };

        const onIntersect = (entries) => {
            entries.forEach((entry) => {
                const index = parseInt(entry.target.dataset.index);
                const videoElement = videoRefs.current[index];

                if (!videoElement) return;

                if (entry.isIntersecting) {
                    videoElement.muted = true;
                    videoElement.play().catch(e => console.log("Video play interrupted:", e));
                    setCurrentPlayingIndex(index);
                } else {
                    videoElement.pause();
                    videoElement.currentTime = 0;
                    if (currentPlayingIndex === index) {
                        setCurrentPlayingIndex(null);
                    }
                }
            });
        };

        const observer = new IntersectionObserver(onIntersect, options);
        reelRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [videos, currentPlayingIndex]);

    const handleVideoToggle = useCallback((index) => {
        const videoElement = videoRefs.current[index];
        if (videoElement) {
            if (videoElement.paused) {
                // Pause all other videos first
                videoRefs.current.forEach((vid, i) => {
                    if (i !== index && !vid.paused) {
                        vid.pause();
                        vid.currentTime = 0;
                    }
                });
                videoElement.play().catch(e => console.log("Video play interrupted:", e));
                setCurrentPlayingIndex(index);
            } else {
                videoElement.pause();
                setCurrentPlayingIndex(null);
            }
        }
    }, []);

    const handleLike = async (videoToLike) => {
        try {
            const response = await axios.post(`${SERVER_URL}/api/food/like`, { foodId: videoToLike._id, token: cookies.token });
            if (response.data.like) {
                setVideos((prevVideos) =>
                    prevVideos.map((v) =>
                        v._id === videoToLike._id ? { ...v, likeCount: (v.likeCount || 0) + 1, isLikedByUser: true } : v
                    )
                );
            } else {
                setVideos((prevVideos) =>
                    prevVideos.map((v) =>
                        v._id === videoToLike._id ? { ...v, likeCount: Math.max((v.likeCount || 1) - 1, 0), isLikedByUser: false } : v
                    )
                );
            }
        } catch (error) {
            console.error('Error liking video:', error);
            // Handle error
        }
    };

    const handleUnsave = async (videoToUnsave) => {
        try {
            const response = await axios.post(`${SERVER_URL}/api/food/save`, { foodId: videoToUnsave._id, token: cookies.token });
            if (!response.data.save) { // If the video is no longer saved
                setVideos((prevVideos) => prevVideos.filter((v) => v._id !== videoToUnsave._id));
            } else {
                // This case should ideally not happen if handleUnsave is only called for saved items
                // but we update the state to reflect it's still saved
                 setVideos((prevVideos) =>
                    prevVideos.map((v) =>
                        v._id === videoToUnsave._id ? { ...v, saves: (v.saves || 0) + 1, isSavedByUser: true } : v
                    )
                );
            }
        } catch (error) {
            console.error('Error unsaving video:', error);
            // Handle error
        }
    };

    if (videos.length === 0) {
        return (
            <>
                <div className="empty-saved">
                    <h2>No saved videos yet</h2>
                    <p>Videos you save will appear here</p>
                </div>
                {/* Bottom Navigation */}
                <nav className="bottom-nav">
                    <button
                        className={`nav-btn ${location.pathname === "/" ? "active" : ""}`}
                        onClick={() => navigate("/")}
                        aria-label="Home"
                    >
                        <FaHome />
                        <span>Home</span>
                    </button>
                    <button
                        className={`nav-btn ${location.pathname === "/saved" ? "active" : ""}`}
                        onClick={() => navigate("/saved")}
                        aria-label="Saved Videos"
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
                        setReelRef={el => setReelRef(el, i)}
                        setVideoRef={el => setVideoRef(el, i)}
                        handleVideoToggle={handleVideoToggle}
                        handleLike={handleLike}
                        handleSave={handleUnsave} // In saved page, handleSave means unsave
                        isSavedPage={true}
                        isPlaying={currentPlayingIndex === i} // Pass isPlaying prop
                    />
                ))}
            </div>
            <nav className="bottom-nav">
                <button
                    className={`nav-btn ${location.pathname === "/" ? "active" : ""}`}
                    onClick={() => navigate("/")}
                    aria-label="Home"
                >
                    <FaHome />
                    <span>Home</span>
                </button>
                <button
                    className={`nav-btn ${location.pathname === "/saved" ? "active" : ""}`}
                    onClick={() => navigate("/saved")}
                    aria-label="Saved Videos"
                >
                    <FaBookmark />
                    <span>Saved</span>
                </button>
            </nav>
        </div>
    );
};

export default Saved;
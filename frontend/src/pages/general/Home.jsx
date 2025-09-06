import { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaBookmark } from 'react-icons/fa';
import Reel from '../../components/Reel'; // Assuming Reel.jsx is in the same directory
import Navigation from '../../components/Navigation'; // Assuming Navigation.jsx exists


const Home = ({SERVER_URL}) => {
    const [videos, setVideos] = useState([]);
    const [cookies] = useCookies(['token']);
    const navigate = useNavigate();
    const location = useLocation();

    // Refs for all video elements and reel containers
    const videoRefs = useRef([]);
    const reelRefs = useRef([]);

    // State to keep track of which video is currently playing by its index
    const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null);

    // Set a ref for a specific video element
    const setVideoRef = useCallback((el, index) => {
        if (el) {
            videoRefs.current[index] = el;
        }
    }, []);

    // Set a ref for a specific reel container
    const setReelRef = useCallback((el, index) => {
        if (el) {
            reelRefs.current[index] = el;
        }
    }, []);

    // Fetch videos from the backend
    useEffect(() => {
        axios.get(`${SERVER_URL}/api/food`, { headers: { 'Authorization': `Bearer ${cookies.token}` } })
            .then((res) => {
                setVideos(res.data.foodItems);
            })
            .catch((err) => {
                console.error('Error fetching videos:', err);
                // Handle error, e.g., redirect to login if token is invalid
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
                    // Mute and play if in view
                    videoElement.muted = true;
                    videoElement.play().catch(e => console.log("Video play interrupted:", e));
                    setCurrentPlayingIndex(index);
                } else {
                    // Pause if not in view
                    videoElement.pause();
                    videoElement.currentTime = 0; // Reset video to start
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


    // Handle manual video play/pause toggle
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

      const response = await axios.post(`${SERVER_URL}/api/food/like`, { foodId: videoToLike._id, token: cookies.token });
        try {
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
            // Handle error, e.g., show a toast message
        }
    };

    const handleSave = async (videoToSave) => {
        try {
            const response = await axios.post(`${SERVER_URL}/api/food/save`, { foodId: videoToSave._id, token: cookies.token });
            if (response.data.save) {
                setVideos((prevVideos) =>
                    prevVideos.map((v) =>
                        v._id === videoToSave._id ? { ...v, saves: (v.saves || 0) + 1, isSavedByUser: true } : v
                    )
                );
            } else {
                setVideos((prevVideos) =>
                    prevVideos.map((v) =>
                        v._id === videoToSave._id ? { ...v, saves: Math.max((v.saves || 1) - 1, 0), isSavedByUser: false } : v
                    )
                );
            }
        } catch (error) {
            console.error('Error saving video:', error);
            // Handle error
        }
    };

    return (
        <div className="home-container">
            {/* <Navigation /> */} {/* Assuming Navigation is a separate component for top bar */}
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
                        handleSave={handleSave}
                        isPlaying={currentPlayingIndex === i} // Pass isPlaying prop
                    />
                ))}
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
        </div>
    );
};

export default Home;
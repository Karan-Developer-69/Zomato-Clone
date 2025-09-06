  import { useEffect, useRef, useCallback, useState } from "react";
  import { Link, useNavigate, useLocation } from "react-router-dom";
  import { FaHome, FaBookmark } from "react-icons/fa";
  import { apiHelpers } from "../../utils/axiosConfig";
  import "../../styles/reels.css";
  import Reel from "../../components/Reel";
  import Navigation from "../../components/Navigation";
  

  const Home = ({ SERVER_URL }) => {
    const [videos, setVideos] = useState([]);
    const videoRefs = useRef([]);
    const reelRefs = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();

    // This function runs on every render to reset the ref arrays, which is correct.
    const resetRefs = () => {
      videoRefs.current = [];
      reelRefs.current = [];
    };
    resetRefs();

    const setVideoRef = (el) => {
      if (el) videoRefs.current.push(el);
    };
    const setReelRef = (el) => {
      if (el) reelRefs.current.push(el);
    };

    // toggle play/pause on click
    const handleVideoToggle = useCallback((idx) => {
      const v = videoRefs.current[idx];
      if (!v) return;
      if (v.paused) {
        v.play();
        v.dataset.playing = "1";
      } else {
        v.pause();
        v.dataset.playing = "0";
      }
    }, []);

    // Fetch videos from API on component mount
    useEffect(() => {
      apiHelpers
        .get(`${SERVER_URL}/api/food`)
        .then((res) => {
          if (res.data && res.data.foodItems) {
            setVideos(res.data.foodItems);
          }
        })
        .catch((err) => {
          console.error("Error fetching food data:", err);
        });
    }, []);

    // IntersectionObserver to auto-play the visible video and pause others
    // *** THIS IS THE CORRECTED PART ***
    useEffect(() => {
      // Don't run if there are no videos loaded yet
      if (videos.length === 0 || reelRefs.current.length === 0) return;

      const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.55, // play when at least 55% visible
      };

      const onIntersect = (entries) => {
        entries.forEach((entry) => {
          const idx = parseInt(entry.target.dataset.index, 10);
          const vid = videoRefs.current[idx];
          if (!vid) return;

          if (entry.isIntersecting) {
            // play the visible one (muted to ensure autoplay works)
            vid.muted = true;
            vid.play().catch(() => {});
            vid.dataset.playing = "1";
          } else {
            vid.pause();
            vid.dataset.playing = "0";
          }
        });
      };

      const io = new IntersectionObserver(onIntersect, options);
      reelRefs.current.forEach((r) => r && io.observe(r));

      // Cleanup function to disconnect observer when component unmounts or videos change
      return () => {
        io.disconnect();
      };
    }, [videos]); // Dependency array updated to re-run this effect when 'videos' state changes

    

    const handleLike = async (videoToLike) => {
      try {
        const response = await apiHelpers.post(`${SERVER_URL}/api/food/like`, {
          foodId: videoToLike._id
        });
        
        if(response.data.like){
          setVideos((prevVideos) =>
            prevVideos.map((v) =>
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
      } catch (error) {
        console.error("Error liking video:", error);
      }
    };

    const handleSave = async (video) => {
      try {
        const response = await apiHelpers.post(`${SERVER_URL}/api/food/save`, {
          foodId: video._id
        });
        
        if(response.data.save){
          setVideos((prevVideos) =>
            prevVideos.map((v) =>
              v._id === video._id ? { ...v, saves: (v.saves || 0) + 1 } : v
            )
          );
        } else {
          setVideos((prevVideos) =>
            prevVideos.map((v) =>
              v._id === video._id ? { ...v, saves: Math.max((v.saves || 1) - 1, 0) } : v
            )
          );
        }
      } catch (error) {
        console.error("Error saving video:", error);
      }
    };

    return (
      <div className="home-container">
        <Navigation />
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
              handleSave={handleSave}
            />
          ))}
        </div>

        <div className="videos-container">
          
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
      </div>
    );
  };

  export default Home;

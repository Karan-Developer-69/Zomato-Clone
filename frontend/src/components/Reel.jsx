import { Link } from 'react-router-dom';
import { FaHeart, FaComment, FaBookmark, FaShare, FaPlay, FaPause, FaStore } from 'react-icons/fa';
import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Component for a single floating heart animation
const FloatingHeart = ({ id, x, y }) => (
    <motion.div
        key={id}
        className="floating-heart"
        initial={{ opacity: 0, scale: 0, y: y, x: x, rotate: Math.random() * 30 - 15 }}
        animate={{
            opacity: [0, 1, 0.8, 0],
            scale: [0.5, 1.2, 1, 0],
            y: [y, y - 100, y - 200, y - 300], // Float upwards
            x: [x, x + (Math.random() - 0.5) * 50], // Slight horizontal drift
        }}
        transition={{
            duration: 1.5,
            ease: "easeOut",
            times: [0, 0.2, 0.8, 1],
        }}
        style={{ position: 'absolute' }}
    >
        <FaHeart />
    </motion.div>
);


const Reel = ({
    video,
    index,
    setReelRef,
    setVideoRef,
    handleVideoToggle,
    handleLike,
    handleSave,
    isSavedPage = false,
    isPlaying, // Prop passed from Home/Saved to indicate current playing state
}) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [showPlayIndicator, setShowPlayIndicator] = useState(false);
    const [indicatorType, setIndicatorType] = useState('play'); // 'play' or 'pause'
    const videoElementRef = useRef(null); // Reference to the actual video DOM element
    const [floatingHearts, setFloatingHearts] = useState([]);
    const lastClickTime = useRef(0);

    // Sync local like/save state with video data
    useEffect(() => {
        setIsLiked(video.isLikedByUser || false); // Assuming video data includes this
        setIsSaved(video.isSavedByUser || false); // Assuming video data includes this
    }, [video.isLikedByUser, video.isSavedByUser]);


    const triggerPlayIndicator = useCallback((type) => {
        setIndicatorType(type);
        setShowPlayIndicator(true);
        const timer = setTimeout(() => setShowPlayIndicator(false), 800); // Show for 800ms
        return () => clearTimeout(timer);
    }, []);

    // Handle single tap for play/pause and double tap for like
    const handleClick = useCallback((event) => {
        const currentTime = new Date().getTime();
        const doubleClickThreshold = 300; // ms

        // Double-tap logic
        if (currentTime - lastClickTime.current < doubleClickThreshold) {
            // It's a double-tap
            lastClickTime.current = 0; // Reset for next double-tap
            if (!isLiked) { // Only like if not already liked
                handleLike(video);
                setIsLiked(true); // Optimistic UI update
                // Trigger floating heart animation at click position
                setFloatingHearts(prev => [
                    ...prev,
                    { id: Date.now(), x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY }
                ]);
            }
        } else {
            // It's a single tap, wait to see if it becomes a double-tap
            lastClickTime.current = currentTime;
            handleVideoToggle(index); // This will trigger play/pause
            triggerPlayIndicator(isPlaying ? 'pause' : 'play'); // Show indicator based on *next* state
        }
    }, [index, handleVideoToggle, handleLike, isLiked, isPlaying, video, triggerPlayIndicator]);


    // Pass the video element ref to the parent's ref array
    const setLocalVideoRef = useCallback((el) => {
        videoElementRef.current = el;
        setVideoRef(el); // Also pass to parent
    }, [setVideoRef]);


    const handleLikeClick = useCallback((e) => {
        e.stopPropagation(); // Prevent propagating to the video click handler
        handleLike(video);
        setIsLiked(prev => !prev);
        if (!isLiked) {
            // When liking, trigger a heart beat animation on the button
            // If you want a floating heart for button click too, add it here
        }
    }, [handleLike, video, isLiked]);

    const handleSaveClick = useCallback((e) => {
        e.stopPropagation(); // Prevent propagating to the video click handler
        handleSave(video);
        setIsSaved(prev => !prev);
    }, [handleSave, video]);


    return (
        <section
            className={`reel ${isPlaying ? 'is-playing' : ''}`}
            role="listitem"
            ref={setReelRef}
            data-index={index}
            onClick={handleClick}
        >
            <video
                className="reel-video"
                ref={setLocalVideoRef}
                src={video.video}
                playsInline
                muted
                loop
                preload="metadata"
                aria-label={`Video ${index + 1}: ${video.description}`}
                // The dataset.playing is handled by the IntersectionObserver in Home/Saved
                // We will rely on the `isPlaying` prop for visual classes here
            />

            <AnimatePresence>
                {showPlayIndicator && (
                    <motion.div
                        className="play-indicator-container"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className={`play-indicator-icon ${indicatorType}-icon`}>
                            {indicatorType === 'play' ? <FaPlay /> : <FaPause />}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating hearts container */}
            <div className="floating-hearts-container" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <AnimatePresence>
                    {floatingHearts.map((heart) => (
                        <FloatingHeart key={heart.id} id={heart.id} x={heart.x} y={heart.y} />
                    ))}
                </AnimatePresence>
            </div>


            <motion.div
                className="reel-overlay"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
            >
                <p className="reel-desc" title={video.description}>
                    {video.description}
                </p>
                <Link className="visit-btn" to={`/food-partner/${video.foodPartner}`}>
                    <FaStore /> Visit store
                </Link>
            </motion.div>

            <div className="reel-actions">
                <button
                    className={`action-btn ${isLiked ? 'active liked' : ''}`}
                    onClick={handleLikeClick}
                    aria-label={`Like video. Current likes: ${video.likeCount || 0}`}
                >
                    <FaHeart />
                    <span>{video.likeCount || 0}</span>
                </button>
                <button
                    className="action-btn"
                    onClick={(e) => e.stopPropagation()} // Prevent video click on comment button
                    aria-label={`View comments. Current comments: ${video.commentCount || 0}`}
                >
                    <FaComment />
                    <span>{video.commentCount || 0}</span>
                </button>
                {isSavedPage ? (
                    <button
                        className="action-btn active" // Always active on saved page for unsave action
                        onClick={handleSaveClick}
                        aria-label={`Unsave video`}
                    >
                        <FaBookmark />
                        <span>Saved</span>
                    </button>
                ) : (
                    <button
                        className={`action-btn ${isSaved ? 'active' : ''}`}
                        onClick={handleSaveClick}
                        aria-label={`Save video. Current saves: ${video.saves || 0}`}
                    >
                        <FaBookmark />
                        <span>{video.saves || 0}</span>
                    </button>
                )}
                {isSavedPage && ( // Share only on saved page, or globally if desired
                    <button
                        className="action-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Implement share functionality here
                            alert('Share functionality not implemented yet!');
                        }}
                        aria-label="Share video"
                    >
                        <FaShare />
                        <span>Share</span>
                    </button>
                )}
            </div>
        </section>
    );
};

export default Reel;
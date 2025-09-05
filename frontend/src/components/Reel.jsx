 
import { Link } from 'react-router-dom';
import { FaHeart, FaComment, FaBookmark, FaShare } from 'react-icons/fa';

const Reel = ({
  video,
  index,
  setReelRef,
  setVideoRef,
  handleVideoToggle,
  handleLike,
  handleSave,
  isSavedPage = false,
}) => {
  return (
    <section
      className="reel"
      role="listitem"
      ref={setReelRef}
      data-index={index}
    >
      <video
        className="reel-video"
        ref={setVideoRef}
        src={video.video}
        playsInline
        muted
        loop
        preload="metadata"
        onClick={() => handleVideoToggle(index)}
        aria-label={`Video ${index + 1}`}
      />

      <div className="reel-overlay">
        <p className="reel-desc" title={video.description}>
          {video.description}
        </p>
        <Link className="visit-btn" to={`/food-partner/${video.foodPartner}`}>
          Visit store
        </Link>
      </div>

      <div className="reel-actions">
        <button
          className='action-btn'
          onClick={() => handleLike(video)}
        >
          <FaHeart />
          <span>{video.likeCount || 0}</span>
        </button>

        <button className="action-btn">
          <FaComment />
          <span>{video.commentCount || 0}</span>
        </button>

        {isSavedPage ? (
          <button
            className="action-btn active"
            onClick={() => handleSave(video)}
          >
            <FaBookmark />
            <span>Saved</span>
          </button>
        ) : (
          <button
            className='action-btn'
            onClick={() => handleSave(video)}
          >
            <FaBookmark />
            <span>{video.saves || 0}</span>
          </button>
        )}

        {isSavedPage && (
          <button className="action-btn">
            <FaShare />
          </button>
        )}
      </div>

      <div className="play-indicator" aria-hidden="true">
        <div className="icon" />
      </div>
    </section>
  );
};

export default Reel;
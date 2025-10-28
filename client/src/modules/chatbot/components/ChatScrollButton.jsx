import { useState, useEffect } from 'react';

export default function ChatScrollButton({ chatContainerRef }) {
  const [atBottom, setAtBottom] = useState(true);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const atBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= 2;
      setAtBottom(atBottom);
      setShowButton(container.scrollHeight > container.clientHeight);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, [chatContainerRef]);

  const handleClick = () => {
    const container = chatContainerRef.current;

    if (!container) return;

    if (atBottom) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  };

  if (!showButton) return null;

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'absolute',
        bottom: '62px',
        right: '25px',
        background: 'var(--button-bg)',
        color: 'var(--text)',
        border: '1px solid var(--border)',
        borderRadius: '50%',
        width: '30px',
        height: '30px',
        fontSize: '18px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        opacity: '0.5',
        transition: 'opacity 0.3s'
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = 1}
      onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
      aria-label={atBottom ? 'Scroll to top' : 'Scroll to bottom'}
    >
      {atBottom ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M6 15l6-6 6 6"/>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      )}
    </button>
  );
}
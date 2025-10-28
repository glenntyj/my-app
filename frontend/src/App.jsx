import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Chatbot from "./pages/Chatbot.jsx";
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [selectedTheme, setSelectedTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  const canvasRef = useRef(null);

  const themes = ['light', 'dark', 'neon'];

   useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // safety check
    const ctx = canvas.getContext("2d");
    let stars = [];
    const numStars = 250;

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Create stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        delta: Math.random() * 0.02 + 0.01,
        dx: (Math.random() - 0.5) * 0.1,
        dy: (Math.random() - 0.5) * 0.1,
      });
    }

    // Animation
    let animationFrameId;
    const color = selectedTheme === 'light' ? '#000000' : selectedTheme === 'dark' ? '#ffffff' : '#00ffff';

    // Helper to convert hex to RGB
    function hexToRgb(hex) {
      const bigint = parseInt(hex.replace("#",""), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return [r, g, b];
    }

    const rgb = hexToRgb(color);
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]},${star.alpha})`;
        ctx.fill();

        // Twinkle
        star.alpha += star.delta;
        if (star.alpha > 1 || star.alpha < 0) star.delta = -star.delta;

        // Drift
        star.x += star.dx * 10;
        star.y += star.dy * 10;

        // Wrap
        if (star.x > canvas.width) star.x = 0;
        if (star.x < 0) star.x = canvas.width;
        if (star.y > canvas.height) star.y = 0;
        if (star.y < 0) star.y = canvas.height;
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    localStorage.setItem("theme", selectedTheme);
    document.documentElement.setAttribute('data-theme', selectedTheme);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [selectedTheme]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const styles = {
  footer: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    textAlign: "center",
    padding: "1rem 0",
    borderTop: "1px solid rgba(255,255,255,0.2)",
    marginTop: "2rem",
    color: "var(--text-color)",
    background: "transparent",
  },
  text: {
    margin: 0,
    fontSize: "0.9rem",
    opacity: 0.7,
  },
};

  return (
      <Router>
        <div className="chat-particles">
          <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
        </div>
        <nav>
          {!isAuthenticated && (
            <>
              <div></div>
              <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                {themes.map(t => (
                  <button key={t} className={selectedTheme === t ? 'selected' : ''} onClick={() => setSelectedTheme(t)}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </>
          )}
          {isAuthenticated && (
            <>
              <div style={{ display:'flex', gap:'8px', alignItems:'center'}}>
                <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>Profile</NavLink>
                <NavLink to="/chatbot" className={({ isActive }) => isActive ? 'active' : ''}>Chatbot</NavLink>
              </div>
              <div style={{ display:'flex', gap:'8px', alignItems:'center'}}>
                {themes.map(t => (
                  <button key={t} className={selectedTheme === t ? 'selected' : ''} onClick={() => setSelectedTheme(t)}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
                <button onClick={handleLogout}>Logout</button>
              </div>
            </>
          )}
        </nav>

        <div className="page-container">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />} />
            <Route path="/chatbot" element={isAuthenticated ? <Chatbot /> : <Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to={isAuthenticated ? "/profile" : "/login"} replace />} />
          </Routes>
        </div>
        <footer>
          <p>© {new Date().getFullYear()} MyApp. All rights reserved.</p>
        </footer>
      </Router>
  );
}

export default App;

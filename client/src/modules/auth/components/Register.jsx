import { useState } from "react";
import axios from "axios";
import "../../../styles/index.css";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [showPopover, setShowPopover] = useState(false);

  const handleEmailChange = (e) => {
    handleChange(e);
    const email = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(email === "" || emailRegex.test(email)); // empty = neutral
  };

  const checkPasswordStrength = (password) => {
    let score = 0;

    // Criteria
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (password.length > 7) {
      if (hasLower) score++;
      if (hasUpper) score++;
      if (hasNumber) score++;
      if (hasSpecial) score++;
      if (password.length >= 12) score++;
    }

    let strength = "Very Weak";

    if (score >= 2) strength = "Weak";
    if (score >= 3) strength = "Medium";
    if (score >= 4) strength = "Strong";
    if (score >= 5) strength = "Very Strong";

    setPasswordStrength(strength);
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const { fullName, username, email, password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        fullName,
        username,
        email,
        password,
      });
      setMessage(res.data.message);
      setFormData({ fullName: "", username: "", email: "", password: "", confirmPassword: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="default-panel">
      <h2>Create Account</h2>

      <div className="form-group">
        <div className="input-icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
          </svg>
          <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
        </div>

        <div className="input-icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24">
            <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
          </svg>
          <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
        </div>

        <div className="input-icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24">
            <path d="M12 13 2 6.76V18h20V6.76L12 13zM12 11l10-6H2l10 6z"/>
          </svg>
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleEmailChange} />
          {!emailValid && (
            <p className="email-error" style={{color:'#e74c3c'}}>Please enter a valid email address</p>
          )}
        </div>

        <div className="input-icon password-field">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24">
            <path d="M12 17a2 2 0 1 0 2-2 2 2 0 0 0-2 2zm6-7h-1V7a5 5 0 0 0-10 0v3H6a2 2 0 0 0-2 2v8h16v-8a2 2 0 0 0-2-2zm-3 0H9V7a3 3 0 0 1 6 0z"/>
          </svg>

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onFocus={() => setShowPopover(true)}
            onBlur={() => setShowPopover(false)}
            onChange={(e) => {
              handleChange(e);
              checkPasswordStrength(e.target.value);
            }}
          />

          {/* Password strength dots */}
          {passwordStrength && (
            <>
              <div className="password-dots">
                {[1, 2, 3, 4, 5].map((dot, index) => {
                  let color = "";
                  if (passwordStrength === "Very Weak" && index === 0) color = "red";
                  if (passwordStrength === "Weak" && index < 2) color = "orange";
                  if (passwordStrength === "Medium" && index < 3) color = "yellow";
                  if (passwordStrength === "Strong" && index < 4) color = "lightgreen";
                  if (passwordStrength === "Very Strong") color = "green";
                  return <span key={index} className={`dot ${color}`}></span>;
                })}
              </div>
              <div className={`password-strength ${passwordStrength.replace(" ", "").toLowerCase()}`}>
                {passwordStrength}
              </div>
            </>
          )}

          {/* Popover */}
          {showPopover && (
            <div className="password-popover">
              <p>Password must contain:</p>
              <ul>
                <li>At least 8 characters</li>
                <li>Contains uppercase and lowercase letters</li>
                <li>At least one number</li>
                <li>At least one special character (!@#$%)</li>
              </ul>
            </div>
          )}
        </div>

        <div className="input-icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24">
            <path d="M12 17a2 2 0 1 0 2-2 2 2 0 0 0-2 2zm6-7h-1V7a5 5 0 0 0-10 0v3H6a2 2 0 0 0-2 2v8h16v-8a2 2 0 0 0-2-2zm-3 0H9V7a3 3 0 0 1 6 0z"/>
          </svg>
          <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="password-mismatch" style={{color:'#e74c3c'}}>Passwords do not match</p>
          )}
        </div>
      </div>

      <button onClick={handleRegister}>Register</button>
      {message && <span>{message}</span>}
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}
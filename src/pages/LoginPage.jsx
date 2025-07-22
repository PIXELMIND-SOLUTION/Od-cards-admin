import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { FaLock, FaEnvelope, FaSignInAlt } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      if (email === "admin@gmail.com" && password === "admin123") {
        sessionStorage.setItem('loginTime', Date.now());
        onLoginSuccess();
        navigate('/customers');
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center p-3"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      }}
    >
      <div
        className="bg-white p-4 p-md-5 rounded-4 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "450px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.95)"
        }}
      >
        <div className="text-center mb-4">
          <div className="mb-3">
            <div
              style={{
                width: "80px",
                height: "80px",
                margin: "0 auto",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <FaLock size={30} color="white" />
            </div>
          </div>
          <h2 className="fw-bold mb-2" style={{ color: "#333" }}>Welcome Back</h2>
          <p className="text-muted">Please enter your credentials to login</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError("")}
                aria-label="Close"
              ></button>
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-medium">Email address</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FaEnvelope className="text-muted" />
              </span>
              <input
                id="email"
                type="email"
                className="form-control py-2"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  borderLeft: "none"
                }}
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-medium">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FaLock className="text-muted" />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-control py-2"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  borderLeft: "none"
                }}
              />
              <button
                type="button"
                className="input-group-text bg-light"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer", border: "none", background: "none" }}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-muted" />
                ) : (
                  <FaEye className="text-muted" />
                )}
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <a href="#!" className="text-decoration-none" style={{ color: "#667eea" }}>
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="btn w-100 fw-bold py-3"
            disabled={isLoading}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "50px",
              fontSize: "1rem",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
            }}
            onMouseOver={(e) => {
              e.target.style.background = "linear-gradient(135deg, #764ba2 0%, #667eea 100%)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging in...
              </>
            ) : (
              <>
                <FaSignInAlt className="me-2" />
                Login
              </>
            )}
          </button>
        </form>

        
      </div>
    </div>
  );
}

export default LoginPage;
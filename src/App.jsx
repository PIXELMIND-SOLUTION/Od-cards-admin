import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

// Layout
import Layout from "./components/Layout";

// Pages
import LoginPage from "./pages/LoginPage";
import Customers from "./pages/Customers/Customers";
import Cards from "./pages/Cards";
import Orders from "./pages/Orders/Orders";
import Banners from "./pages/Banners/Banners";
import AboutUs from "./pages/AboutUs/AboutUs";
import ContactUs from "./pages/ContactUs/ContactUs";
import Reviews from "./pages/Reviews/Reviews";
import Faqs from "./pages/Faqs/Faq";
import Scroller from "./pages/Scroller/Scroller";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check sessionStorage for existing auth state
    return sessionStorage.getItem('isLoggedIn') === 'true';
  });

  const handleLogin = () => {
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('loginTime', Date.now());
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('loginTime');
    setIsLoggedIn(false);
  };

  // Check session timeout periodically
  useEffect(() => {
    const checkAuthTimeout = () => {
      const loginTime = sessionStorage.getItem('loginTime');
      if (loginTime && Date.now() - loginTime > 3600000) { // 1 hour timeout
        handleLogout();
      }
    };

    checkAuthTimeout();
    const interval = setInterval(checkAuthTimeout, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-bg min-vh-100">
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={
              isLoggedIn ? (
                <Navigate to="/customers" />
              ) : (
                <LoginPage onLoginSuccess={handleLogin} />
              )
            } 
          />
          
          <Route 
            path="/" 
            element={
              isLoggedIn ? (
                <Layout onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          >
            <Route index element={<Navigate to="/customers" />} />
            <Route path="customers" element={<Customers />} />
            <Route path="cards" element={<Cards />} />
            <Route path="orders" element={<Orders />} />
            <Route path="banners" element={<Banners />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="contact-us" element={<ContactUs />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="faqs" element={<Faqs />} />
            <Route path="scroller" element={<Scroller />} />
          </Route>

          <Route 
            path="*" 
            element={
              isLoggedIn ? (
                <Navigate to="/customers" />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
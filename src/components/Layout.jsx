import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaIdCard,
  FaShoppingCart,
  FaImages,
  FaInfoCircle,
  FaPhone,
  FaStar,
  FaQuestionCircle,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronRight,
  FaPlus,
  FaEdit,
  FaTrash,
  FaList,
  FaBars
} from "react-icons/fa";

function Layout({ onLogout }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("loginTime");
    if (onLogout) onLogout();
    navigate("/login");
  };

  const toggleMenu = (menu) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  const menuItems = [
    {
      name: "customers",
      label: "Customers",
      icon: FaUsers,
      to: "/customers"
    },
    {
      name: "cards",
      label: "Cards",
      icon: FaIdCard,
      subItems: [
        { name: "cards", label: "List", icon: FaList },
        { name: "create", label: "Create", icon: FaPlus },
        { name: "update", label: "Update", icon: FaEdit },
        { name: "delete", label: "Delete", icon: FaTrash }
      ]
    },
    {
      name: "orders",
      label: "Orders",
      icon: FaShoppingCart,
      subItems: [
        { name: "orders", label: "List", icon: FaList },
        { name: "create", label: "Create", icon: FaPlus },
        { name: "update", label: "Update", icon: FaEdit },
        { name: "delete", label: "Delete", icon: FaTrash }
      ]
    },
    { name: "banners", label: "Banners", icon: FaImages, to: "/banners" },
    { name: "about-us", label: "About Us", icon: FaInfoCircle, to: "/about-us" },
    { name: "contact-us", label: "Contact Us", icon: FaPhone, to: "/contact-us" },
    { name: "reviews", label: "Reviews", icon: FaStar, to: "/reviews" },
    { name: "faqs", label: "FAQs", icon: FaQuestionCircle, to: "/faqs" }
  ];

  return (
    <div className="d-flex flex-column vh-100 bg-light">
      {/* Top Nav */}
      <nav className="navbar navbar-expand-lg navbar-white bg-white shadow-sm">
        <div className="container-fluid">
          <button
            className="navbar-toggler me-2 border-0"
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars className="text-dark" />
          </button>
          <span className="navbar-brand fw-bold text-primary">OD Cards Admin</span>
          <button
            className="btn btn-outline-primary ms-auto d-flex align-items-center"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="me-1" />
            <span className="d-none d-md-inline">Logout</span>
          </button>
        </div>
      </nav>

      <div className="d-flex flex-grow-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`d-flex flex-column ${sidebarOpen ? "d-block" : "d-none"} d-lg-block`}
          style={{
            width: "280px",
            minWidth: "280px",
            background: "#f8f9fa",
            boxShadow: "2px 0 10px rgba(0,0,0,0.1)"
          }}
        >
          <div className="p-3 border-bottom">
            <h6 className="mb-0 text-primary">Admin Menu</h6>
          </div>
          <div className="flex-grow-1 overflow-auto">
            <ul className="nav flex-column px-2 py-3">
              {menuItems.map((item) => (
                <li className="nav-item mb-1" key={item.name}>
                  {item.subItems ? (
                    <>
                      <div
                        className="nav-link d-flex justify-content-between align-items-center py-2 px-3 rounded text-dark"
                        style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                        onClick={() => toggleMenu(item.name)}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <item.icon className="text-primary" />
                          <span>{item.label}</span>
                        </div>
                        {expandedMenu === item.name ? (
                          <FaChevronDown size={14} />
                        ) : (
                          <FaChevronRight size={14} />
                        )}
                      </div>
                      {expandedMenu === item.name && (
                        <ul className="nav flex-column ps-4 mt-1">
                          {item.subItems.map((subItem) => (
                            <li key={subItem.name} className="nav-item">
                              <NavLink
                                to={`/${subItem.name}`}
                                className={({ isActive }) =>
                                  `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded ${
                                    isActive ? "bg-primary text-white" : "text-dark"
                                  }`
                                }
                              >
                                {({ isActive }) => (
                                  <>
                                    <subItem.icon
                                      className={isActive ? "text-white" : "text-primary"}
                                    />
                                    <span>{subItem.label}</span>
                                  </>
                                )}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded ${
                          isActive ? "bg-primary text-white" : "text-dark"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className={isActive ? "text-white" : "text-primary"} />
                          <span>{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`flex-grow-1 overflow-auto p-3 ${sidebarOpen && isMobile ? "d-none" : ""}`}
          style={{
            marginLeft: sidebarOpen && !isMobile ? "0" : "0",
            transition: "margin-left 0.3s",
            background: "#ffffff"
          }}
        >
          <div className="container-fluid">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;

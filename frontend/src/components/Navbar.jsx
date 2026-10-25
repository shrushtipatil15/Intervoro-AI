import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function getStoredUser() {
    try {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
}

function getDisplayName(user) {
    if (!user) return "User";

    const name =
        user.name ||
        user.full_name ||
        user.fullName ||
        user.username ||
        user.display_name;

    if (typeof name === "string" && name.trim()) {
        return name.trim();
    }

    if (user.email) {
        return user.email.split("@")[0];
    }

    return "User";
}

function Navbar() {
    const navigate = useNavigate();

    const [user, setUser] = useState(getStoredUser);
    const [isLoggedIn, setIsLoggedIn] = useState(
        () => Boolean(localStorage.getItem("token"))
    );
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    useEffect(() => {
        const updateAuth = () => {
            setUser(getStoredUser());
            setIsLoggedIn(Boolean(localStorage.getItem("token")));
            setDropdownOpen(false);
        };

        window.addEventListener("authChange", updateAuth);
        window.addEventListener("storage", updateAuth);

        return () => {
            window.removeEventListener("authChange", updateAuth);
            window.removeEventListener("storage", updateAuth);
        };
    }, []);

    useEffect(() => {
        if (!profileOpen) return;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setProfileOpen(false);
            }
        };

        window.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [profileOpen]);

    const displayName = getDisplayName(user);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
        setIsLoggedIn(false);
        setDropdownOpen(false);
        setProfileOpen(false);

        window.dispatchEvent(new Event("authChange"));
        navigate("/login", { replace: true });
    };

    const openProfile = () => {
        setDropdownOpen(false);
        setProfileOpen(true);
    };

    return (
        <>
            <nav className="navbar">
                <div
                    className="logo"
                    onClick={() => navigate("/")}
                    role="button"
                    tabIndex={0}
                >
                    Intervoro AI
                </div>

                <div className="nav-menu">
                    <span className="nav-item" onClick={() => navigate("/")}>
                        Home
                    </span>

                    <span
                        className="nav-item"
                        onClick={() => navigate("/features")}
                    >
                        Features
                    </span>

                    <span
                        className="nav-item"
                        onClick={() => navigate("/contact")}
                    >
                        Contact Us
                    </span>

                    <span
                        className="nav-item"
                        onClick={() => navigate("/about")}
                    >
                        About
                    </span>
                </div>

                <div className="nav-links">
                    {isLoggedIn ? (
                        <div className="profile-wrapper">
                            <button
                                type="button"
                                className="profile-trigger"
                                onClick={() =>
                                    setDropdownOpen((previous) => !previous)
                                }
                                aria-expanded={dropdownOpen}
                            >
                                <span className="profile-avatar">
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="27"
                                        height="27"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7" />
                                    </svg>
                                </span>

                                <span className="profile-name">
                                    {displayName}
                                </span>

                                <span className="profile-arrow">
                                    {dropdownOpen ? "▲" : "▼"}
                                </span>
                            </button>

                            {dropdownOpen && (
                                <div className="profile-dropdown">
                                    <button
                                        type="button"
                                        onClick={openProfile}
                                    >
                                        <span>👤</span> Profile
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                    >
                                        <span>↪</span> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            type="button"
                            className="nav-register"
                            onClick={() => navigate("/register")}
                        >
                            Sign Up
                        </button>
                    )}
                </div>
            </nav>

            {/* PROFILE SIDEBAR */}
            {profileOpen && (
                <div
                    className="profile-sidebar-overlay"
                    onClick={() => setProfileOpen(false)}
                >
                    <aside
                        className="profile-sidebar"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="profile-sidebar-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="profile-sidebar-header">
                            <div>
                                <span className="profile-sidebar-eyebrow">
                                    YOUR ACCOUNT
                                </span>
                                <h2 id="profile-sidebar-title">
                                    My Profile
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="profile-close-btn"
                                onClick={() => setProfileOpen(false)}
                                aria-label="Close profile sidebar"
                            >
                                ×
                            </button>
                        </div>

                        <div className="profile-user-summary">
                            <div className="profile-large-avatar">
                                {displayName.charAt(0).toUpperCase()}
                            </div>

                            <h3>{displayName}</h3>
                            <p>{user?.email || "Email not available"}</p>

                            <span className="profile-status">
                                <span className="profile-status-dot" />
                                Logged in
                            </span>
                        </div>

                        <div className="profile-details">
                            <h3>Account Details</h3>

                            <div className="profile-detail-row">
                                <span className="profile-detail-icon">👤</span>
                                <div>
                                    <span className="profile-detail-label">
                                        Username
                                    </span>
                                    <p>{displayName}</p>
                                </div>
                            </div>

                            <div className="profile-detail-row">
                                <span className="profile-detail-icon">✉️</span>
                                <div>
                                    <span className="profile-detail-label">
                                        Email Address
                                    </span>
                                    <p>{user?.email || "Not available"}</p>
                                </div>
                            </div>

                            <div className="profile-detail-row">
                                <span className="profile-detail-icon">🔐</span>
                                <div>
                                    <span className="profile-detail-label">
                                        Account Status
                                    </span>
                                    <p>Authenticated</p>
                                </div>
                            </div>
                        </div>

                        <div className="profile-sidebar-footer">
                            <button
                                type="button"
                                className="profile-logout-btn"
                                onClick={handleLogout}
                            >
                                <span>↪</span> Logout
                            </button>

                            <p>Intervoro AI · Interview smarter</p>
                        </div>
                    </aside>
                </div>
            )}
        </>
    );
}

export default Navbar;
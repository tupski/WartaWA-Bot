import React, { useState } from 'react';
import './Header.css';

const Header = ({ onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className="header">
      <div className="header-title">Dashboard</div>
      <div className="profile-section" onClick={handleDropdownToggle}>
        <img
          src="https://via.placeholder.com/40"
          alt="User"
          className="profile-pic"
        />
        {showDropdown && (
          <div className="dropdown-menu">
            <button onClick={onLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

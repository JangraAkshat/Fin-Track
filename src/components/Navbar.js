import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { ShieldCheck, Sun, Moon } from 'lucide-react';

import logoLight from '../assets/logo-light.png';
import logoDark from '../assets/logo-dark.png';

const Navbar = () => {
  const { role, setRole, darkMode, toggleDarkMode } = useFinance();

  return (
    <nav className="navbar-container">
      <div className="card navbar-card">
        {/* Logo Section with Cross-Fade Container */}
        <div className="logo-wrapper">
          <img 
            src={logoLight} 
            alt="FinTrack Logo" 
            className={`navbar-logo-img logo-light ${!darkMode ? 'visible' : ''}`} 
          />
          <img 
            src={logoDark} 
            alt="FinTrack Logo" 
            className={`navbar-logo-img logo-dark ${darkMode ? 'visible' : ''}`} 
          />
        </div>
        
        <div className="nav-actions">
          <div className="theme-toggle-wrapper" onClick={toggleDarkMode}>
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span>{darkMode ? 'Light' : 'Dark'}</span>
          </div>

          <div className="role-divider"></div>

          <div className="mode-status">
            <ShieldCheck size={18} className="mode-icon" />
            <span className="mode-text">Mode: <strong>{role.toUpperCase()}</strong></span>
          </div>

          <button 
            onClick={() => setRole(role === 'admin' ? 'viewer' : 'admin')} 
            className="btn-toggle"
          >
            {role === 'admin' ? 'To Viewer' : 'To Admin'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
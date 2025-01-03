import React, { useState } from 'react';
import './SideBar.css'; // Import the enhanced CSS

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2>{!isCollapsed && 'LMS'}</h2>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <i className={`fas ${isCollapsed ? 'fa-arrow-right' : 'fa-arrow-left'}`}></i>
        </button>
      </div>
      <ul className="sidebar-menu">
        <li>
          <a href="/course">
            <i className="fas fa-book"></i>
            {!isCollapsed && <span>Add Course</span>}
          </a>
        </li>
        <li>
          <a href="/Admin"> 
            <i className="fas fa-tasks"></i>
            {!isCollapsed && <span>Admin</span>}
          </a>
        </li>
        <li>
          <a href="/Student">
            <i className="fas fa-user-graduate"></i>
            {!isCollapsed && <span>Students</span>}
          </a>
        </li>
        <li>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

import React from 'react';
import { Link } from 'react-router-dom';
import { RouteBuilder } from '../app/routes';
import './header.css';

export const Header: React.FC = () =>
  <header className="header-container">
    <div className="header-content">
      <nav className="header-nav">
        <Link className="header-link" to={RouteBuilder.Landing()}>
          <img src="/logo120.png" alt="Logo" />
          Stremio Proxy
        </Link>
        
      </nav>
    </div>
  </header>;

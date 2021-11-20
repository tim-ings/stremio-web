import React from 'react';
import { Header } from './header';
import './page.css';

export const Page: React.FC = ({ children }) =>
  <div className="page">
    <Header />
    <div className="page-content">
      {children}
    </div>
  </div>;

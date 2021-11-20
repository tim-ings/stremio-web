import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { RouteBuilder } from '../../app/routes';

export const NotFoundPage: React.FC = () =>
  <div>
    <Helmet>
      <title>Not Found | Stremio Proxy</title>
    </Helmet>
    <div>
      <h2>404 - Page not found</h2>
      <Link to={RouteBuilder.Landing()}>Return Home</Link>
    </div>
  </div>;

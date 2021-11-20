import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/landing/page';
import { Page } from './components/page';
import { NotFoundPage } from './pages/not-found/page';
import { AppContext, useInitialiseAppContext } from './app/context';
import { RouteBuilder } from './app/routes';
import { WatchPage } from './pages/watch/page';

export const App: React.FC = () => {
  const context = useInitialiseAppContext({
    searchResults: [],
  });

  return (
    <AppContext.Provider value={{ ...context }}>
      <Content />
    </AppContext.Provider>
  );
};

const Content: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={RouteBuilder.Landing()} element={<LandingPage />} />
        <Route path={RouteBuilder.Watch(`:streamId`)} element={<WatchPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

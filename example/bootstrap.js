import '@babel/polyfill';

import React from 'react';
import App, { routes } from './App';
import { render } from 'react-dom';
import { BrowserRouter as Router, Link, Switch } from 'react-router-dom';
import ResolveRoute from '../src/Resolve';
import { renderToString } from 'react-dom/server';

const renderApp = async () => {
  const resolvedRoutes = await ResolveRoute(routes, location.pathname);
  render(
    <Router context={{ firstLoad: 'yes' }}>
      <App routes={resolvedRoutes} />
    </Router>,
    document.getElementById('app'),
  );
};

renderApp();

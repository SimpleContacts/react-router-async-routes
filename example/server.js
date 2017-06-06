import React from 'react';
import express from 'express';
import path from 'path';
import ResolveRoutes from '../src/Resolve';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App, { routes } from './App';

const app = express();

app.use('/', express.static(path.join(__dirname, 'public')));

app.use(async function(req, res) {
  const resolvedRoutes = await ResolveRoutes(routes, req.url);

  const html = renderToString(
    <StaticRouter location={req.url} context={{ foo: 'bar' }}>
      <App routes={resolvedRoutes} />
    </StaticRouter>,
  );

  // const html = '';

  res.send(`
    <head>
      <style>
        .fade-enter {
          opacity: 0.01;
        }

        .fade-enter.fade-enter-active {
          opacity: 1;
          transition: opacity .5s ease-in;
        }

        .fade-appear {
          opacity: 0.01;
        }

        .fade-appear.fade-enter-active {
          opacity: 1;
          transition: opacity .5s ease-in;
        }
      </style>
    </head>
    <body>
      <div id="app">${html}</div>
      <script src="/bootstrap.js"></script>
    </body>
  `);
});

app.listen(8081);

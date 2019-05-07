import React from 'react';
import Resolve from './Resolve';
import Route from './Route';
import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import ExampleApp, { routes as exampleRoutes } from '../example/App';

test('Should only evaluate current routes', async () => {
  const error = () => {
    throw new Error('Oops');
  };

  const pathname = '/bubblegum';

  const markup = await Resolve(
    <StaticRouter location={pathname} context={{}}>
      <div>
        <Route async path="/page1" component={error} />
        <Route path="/page2" render={error} />
        <Route async path="/page2" render={error} />
      </div>
    </StaticRouter>,
    pathname,
  );

  expect(renderToString(markup));
});

test('Use loading component when loading async component', () => {
  const pathname = '/page';

  const markup = (
    <StaticRouter location={pathname} context={{}}>
      <div>
        <Route
          async
          path="/page"
          loading={<div>Loading!!!</div>}
          render={() => Promise.resolve(<div>Loaded</div>)}
        />
      </div>
    </StaticRouter>
  );

  expect(!!renderToString(markup).match(/Loading/)).toBe(true);
  expect(!!renderToString(markup).match(/Loaded/)).toBe(false);
});

test('ResolveRoutes can resolve async routes to produce markup that can be rendered synchronously', async () => {
  const pathname = '/github/SimpleContacts';

  const markup = await Resolve(
    <StaticRouter location={pathname} context={{}}>
      <div>
        <Route
          async
          path="/github/SimpleContacts"
          loading={<div>Loading</div>}
          render={() => Promise.resolve(<div>Loaded</div>)}
        />
        <Route
          path="/page"
          loading={<div>Loading</div>}
          render={() => <div>Not related</div>}
        />
      </div>
    </StaticRouter>,
    pathname,
  );

  expect(!!renderToString(markup).match(/Loading/)).toBe(false);
  expect(!!renderToString(markup).match(/Loaded/)).toBe(true);
});

test('ResolveRoutes can resolve the example app', async () => {
  const resolvedRoutes = await Resolve(exampleRoutes, '/');

  expect(
    !!renderToString(
      <StaticRouter location={'/'} context={{}}>
        <ExampleApp routes={resolvedRoutes} />
      </StaticRouter>
    ).match(/Home/),
  ).toBe(true);
});

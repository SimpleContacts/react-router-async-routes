import 'isomorphic-fetch';
import React from 'react';
import Route from '../src/Route';
import { Link, Switch, StaticRouter } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';

const Loading = () => <div>Loading...</div>;

const renderGithubInfo = async ({ match }) => {
  const [Page2, data] = await Promise.all([
    import(/* webpackChunkName: "Page2" */ './pages/github').then(
      C => C.default,
    ),
    fetch(`https://api.github.com/users/${match.params.username}`).then(res =>
      res.json(),
    ),
  ]);
  return <Page2 {...data} />;
};

const renderSlowPage = () =>
  new Promise(resolve =>
    setTimeout(
      () =>
        resolve(
          <div>
            <h2>Page 4</h2>
            <p>That Took awhile</p>
          </div>,
        ),
      1000,
    ),
  );

const FadeInTransition = {
  // appear: true,
  timeout: 500,
  classNames: 'alert',
  // unmountOnExit: true,
  onEnter: () => console.log('entered4'),
  onExited: () => console.log('exited2'),
};

export const routes = (
  <div style={{ position: 'relative' }} className="wrapper">
    <Route transition={FadeInTransition} exact path="/" component={Home} />
    <Route
      transition={FadeInTransition}
      exact
      path="/about/:filter"
      component={About}
    />
    <Route
      transition={FadeInTransition}
      path="/page1"
      async
      component={() => import(/* webpackChunkName: "Page1" */ './pages/page1')}
    />
    <Route
      transition={FadeInTransition}
      path="/github/:username"
      async
      render={renderGithubInfo}
    />
    <Route
      transition={FadeInTransition}
      path="/slow"
      async
      loading={<div>Loading this slow page...</div>}
      render={renderSlowPage}
    />
  </div>
);

export default ({ routes }) => (
  <div>
    <h3>Async Routes and transitions with Server Side Rendering</h3>
    <ul>
      <li>
        <Link to="/">Home (Sync)</Link>
      </li>
      <li>
        <Link to="/about/me">About Me (Sync)</Link>
      </li>
      <li>
        <Link to="/about/team">About the Team(Sync)</Link>
      </li>
      <li>
        <Link to="/page1">Page 1 (code-split)</Link>
      </li>
      <li>
        <Link to="/github/SimpleContacts">
          SimpleContacts Github Info (code-split and fetch from github)
        </Link>
      </li>
      <li>
        <Link to="/github/airbnb">
          AirBnb Github Info (code-split and fetch from github)
        </Link>
      </li>
      <li>
        <Link to="/slow">Slow loading page (Slow fetch, setTimeout)</Link>
      </li>
    </ul>

    <hr />

    <div>{routes}</div>
  </div>
);

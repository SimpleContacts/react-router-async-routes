# Async Routes and transitions for React Router v4

Extend \<Route> API to include async rendering and transitions. This is useful to do webpack code-splitting and fetching essential data before rendering.

## Install

`npm install react-router-async-routes --save`

or

`yarn add react-router-async-routes`

## Usage

To make a asynchronous route, use the `async` prop. When using the async prop, the _component_ prop becomes a function that evaluates to a promise of the component. The _render_ prop becomes a promise of the render method. The transition _prop_ can include options for 'react-transition-group'.

```js
import("isomorphic-fetch");
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Home from "./home";
import Page1 from "./page1";
import Page3 from "./page3";
import Route from "react-router-async-routes";

const FadeInTransition = {
  transitionName: "example",
  transitionAppear: false,
  transitionEnterTimeout: 500,
  transitionEnter: true,
  transitionLeave: false
};

const myErrorHandler = () => {
  console.error("Error loading page...");
};

const routes = (
  <div>
    {/* Original API */}
    <Route path="/" component={Home} />

    {/* Route with transition */}
    <Route transition={FadeInTransition} path="/page1" component={Page1} />

    {/* Code Split */}
    <Route
      async
      path="/page2"
      component={() => import("./page2")}
      onError={myErrorHandler}
    />

    {/* Fetch data before render */}
    <Route
      async
      path="/page3"
      render={() => fetch("/api/endpoint1").then(data => <Page3 data={data} />)}
    />

    {/* Code split, data fetch and transition */}
    <Route
      async
      transition={FadeInTransition}
      path="/page4"
      render={async () => {
        const [Page5, data] = await Promise.all([
          import("./page3"),
          fetch("/api/endpoint2")
        ]);
        return <Page3 data={data} />;
      }}
    />
  </div>
);

render(<BrowserRouter>{routes}</BrowserRouter>);
```

## Static Rendering

The async routes can be preprocessed and resolved using _resolveRoutes_. Once resolved, React.renderToString can be used.

```js
import express from "express";
import { resolveRoutes } from "react-router-async-routes";
import { renderToString } from "react-dom/server";
import App, { routes } from "./App";

app.use(async function(req, res) {
  const resolvedRoutes = await ResolveRoutes(routes, req.url);

  const html = renderToString(
    <StaticRouter location={req.url} context={{}}>
      {resolvedRoutes}
    </StaticRouter>
  );

  res.send(`<body><div id='app'>${html}</div></body>`);
});
```

## Example

To run the example do a yarn start. You can view the example using the webpack-dev-server via http://localhost:8080. When changes are detected to server or client, the service is restarted automatically (via pm2).

If you want to see the example with bundled files. Run `yarn run build-example`, then `yarn start`, and access via http://localhost:8081.

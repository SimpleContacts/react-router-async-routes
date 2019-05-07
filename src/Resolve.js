import React from 'react';
import { matchPath } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import traverse from '@simple-contacts/react-traverse';

import { AsyncHandler } from './Route';
import Route, { resolveProps } from './Route';

// Recursive function to resolve all routes.
const stepThrough = (node, pathname, resolvedRoutes = []) => {
  const additionalRoutesToResolve = [];

  const MarkupWithResolvedRoutes = traverse(node, {
    ComponentElement(path) {
      // Lets see if this is one of our Route components
      if (path.node.type === Route) {
        // If this route matches the current route.
        const match = matchPath(pathname, path.node.props);
        if (match) {
          const key = createMemoryHistory({
            initialEntries: [pathname], // The initial URLs in the history stack
            initialIndex: 0, // The starting index in the history stack
          }).location.key;

          // We can render non-async Routes same as always, but async are custom.
          if (path.node.props.async) {
            // lets go through the resolvedRoutes to see
            // if we this route resolved already.
            const resolvedRoute = resolvedRoutes.find(
              ([key, props]) => key === path.node.key,
            );

            if (resolvedRoute) {
              // Lets dynamically update this route to be a non-async Route
              // and pass in the currect props.
              return React.createElement(
                Route,
                { ...path.node.props, prefetch: resolvedRoute[1] },
                ...path.traverseChildren(),
              );
            } else {
              // if we don't have it resolved, set it up to
              // do that next iteration.

              // Lets set up a promise to resolve this route.
              const nodeKey = path.node.key;
              const {
                children,
                async,
                ...currentPropsWithoutChildren
              } = path.node.props;
              const promise = resolveProps({
                ...currentPropsWithoutChildren,
                match,
              }).then(([component, render]) => {
                return [
                  nodeKey,
                  {
                    pathname,
                    component,
                    render: render ? () => render : undefined,
                  },
                ];
              });
              additionalRoutesToResolve.push(promise);

              // This is mroe or less ignored.
              return React.createElement(
                Route,
                path.node.props,
                ...path.traverseChildren(),
              );
            }
          }
        }
      }

      return React.cloneElement(
        path.node,
        path.node.props,
        ...path.traverseChildren(),
      );
    },
  });

  // In reality this method only does one pass, but setup to be recursive.
  if (additionalRoutesToResolve.length) {
    return Promise.all(additionalRoutesToResolve).then(newResolvedRoutes =>
      stepThrough(node, pathname, [...resolvedRoutes, ...newResolvedRoutes]),
    );
  } else {
    return Promise.resolve(MarkupWithResolvedRoutes);
  }
};

export default (node, pathname) => stepThrough(node, pathname);

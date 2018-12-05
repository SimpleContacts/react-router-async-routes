import React, { Component } from "react";
import { CSSTransitionGroup } from "react-transition-group";
import { Route } from "react-router";
import { findDOMNode } from "react-dom";

// This is used on server and client.
export const resolveProps = props => {
  return Promise.all([
    props.component && props.component(),
    props.render && props.render(props)
  ]).then(([component, render]) => [
    // Manage es6 moduels and commonjs gracefully.
    component && component.default ? component.default : component,
    render
  ]);
};

// This component will show a loading screen until we successfully pull
// the asyncrounous content.
export class AsyncHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.runAsync();
  }

  // Becasue a Switch only displays one component, there is no remounts.
  // We need to check if we need to rerender.
  componentDidUpdate(prevProps) {
    if (prevProps.location.key != this.props.location.key) this.runAsync();
    return true;
  }

  // Lets start our promises right away.
  runAsync() {
    // We are flexible to handle a promise in component or render.
    return resolveProps(this.props)
      .then(([component, render]) => {
        this.setState({
          // Lets not fall into es-modules commonjs hell.
          component,
          render: render ? () => render : null,
          isFinished: true
        });
      })
      .catch(e => {
        if (this.props.onError) {
          this.props.onError();
        } else {
          throw e;
        }
      });
  }

  render() {
    const { component, render, isFinished } = this.state;
    const { loading, prefetch, match } = this.props;

    // Show loading content or nothing until finished loading.
    let content = <div>{loading || null}</div>;

    // If its finished show the route.
    if (isFinished) {
      content = <Route {...this.props} {...this.state} />;
    }

    // If we have a prefetched component and data, lets show it instead of a loading screen.
    if (prefetch && prefetch.pathname === match.url) {
      content = <Route {...this.props} {...this.state} {...prefetch} />;
    }

    // By wrapping in this div, our css transition still works while the content
    // changes.
    return <div>{content}</div>;
  }
}

// A AsyncRoute just wraps a AsyncHandler around the component/render
// method.
export const AsyncRoute = props => (
  <Route
    {...props}
    render={moreProps => {
      return <AsyncHandler {...props} {...moreProps} {...moreProps.match} />;
    }}
    component={undefined}
  />
);

// A TransitionRoute just wraps a CSSTransitionGroup around our Route.
// This factory allows us to use max code reuse.
export const TransitionRouteFactory = AbstractRoute => ({
  transition,
  ...rest
}) => (
  <Route
    render={({ location }) => (
      <CSSTransitionGroup {...transition}>
        <AbstractRoute location={location} key={location.key} {...rest} />
      </CSSTransitionGroup>
    )}
  />
);

export const TransitionRoute = TransitionRouteFactory(Route);
export const AsyncTransitionRoute = TransitionRouteFactory(AsyncRoute);

export default ({ async, transition, ...rest }) =>
  async ? (
    transition ? (
      <AsyncTransitionRoute {...rest.match} {...rest} transition={transition} />
    ) : (
      <AsyncRoute {...rest.match} {...rest} />
    )
  ) : transition ? (
    <TransitionRoute {...rest.match} {...rest} transition={transition} />
  ) : (
    <Route {...rest.match} {...rest} />
  );

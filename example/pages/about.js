import React from 'react';

export default ({ match: { params: { filter } } }) => {
  return (
    <div>
      <h2>About {filter}</h2>
      <p>
        More information here.
      </p>
    </div>
  );
};

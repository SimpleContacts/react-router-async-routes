import React from 'react';

export default ({ name, location, avatar_url }) => {
  return (
    <div>
      <h2>Page 2</h2>
      <p>{name}</p>
      <p>{location}</p>
      <img src={avatar_url} style={{ height: 50 }} />
    </div>
  );
};

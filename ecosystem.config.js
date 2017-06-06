module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    // First application
    {
      name: 'Webpack Development Server',
      exec_interpreter: 'babel-node',
      script: 'webpack-dev-server',
      watch: ['./webpack.config.babel.js'],
    },

    // Second application
    {
      name: 'Express Web Server',
      exec_interpreter: 'babel-node',
      script: './example/server.js',
      watch: true,
    },
  ],
};

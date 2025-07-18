// prebuild.config.js
module.exports = function withCustomConfig(config) {
    if (!config.ios) config.ios = {};
    config.ios.flipper = false;
    return config;
  };
  
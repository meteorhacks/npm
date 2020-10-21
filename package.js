Package.describe({
  summary: "Use npm modules with your Meteor App",
  version: "1.5.1",
  git: "https://github.com/meteorhacks/npm.git",
  name: "meteorhacks:npm"
});

Package.registerBuildPlugin({
  name: "initializing-npm-support",
  use: [
    'underscore@1.0.2'
  ],
  sources: [
    'plugin/init_npm.js'
  ],
  npmDependencies: {
    'mkdirp': '0.5.0',
    'node-echo': '0.1.1',
    'js-beautify': '1.5.5'
  }
});

Package.onUse(function (api, where) {
  api.imply('meteorhacks:async@1.0.0');
});

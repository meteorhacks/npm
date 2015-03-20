Package.describe({
  summary: "Use npm modules with your Meteor App",
  version: "1.2.2",
  git: "https://github.com/meteorhacks/npm.git",
  name: "meteorhacks:npm"
});

Package.registerBuildPlugin({
  name: "initializing-npm-support",
  use: [
    'underscore'
  ],
  sources: [
    'plugin/init_npm.js'
  ],
  npmDependencies: {
    'mkdirp': '0.5.0',
    'rimraf': '2.2.8',
    'node-echo': '0.1.1',
    'js-beautify': '1.5.5'
  }
});

Package.onUse(function (api, where) {
  api.imply('meteorhacks:async@1.0.0');
});

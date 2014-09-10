Package.describe({
  summary: "Use npm modules with your Meteor App",
  version: "1.2.0",
  git: "https://github.com/meteorhacks/npm.git",
  name: "meteorhacks:npm"
});

Package._transitional_registerBuildPlugin({
  name: "initializing-npm-support",
  use: [],
  sources: [
    'plugin/init_npm.js'
  ],
  npmDependencies: {}
});

Package.onUse(function (api, where) {
  api.imply('meteorhacks:async@1.0.0');
});
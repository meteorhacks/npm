Package.describe({
  summary: "Use npm modules with your Meteor App",
  version: "1.1.4",
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

Package.on_use(function (api, where) {
  api.export('Async');
  api.add_files(['index.js'], 'server');
});

Package.on_test(function (api) {
  if(api.versionsFrom) {
    api.versionsFrom('METEOR@0.9.0');
  }

  api.use(['tinytest']);
  api.add_files(['index.js', 'test.js'], 'server');
});

var path = Npm.require('path');
var fs = Npm.require('fs');
var packagesJsonFile = path.resolve('./packages.json');

try {
  var fileContent = fs.readFileSync(packagesJsonFile);
  var packages = JSON.parse(fileContent.toString());
  Npm.depends(packages);
} catch(ex) {
  if(ex.code == 'ENOENT') {
    console.warn('WARN: no packages.json file found on the project root');
  } else if(true) {
    console.error('ERROR: packages.json parsing error [ ' + ex.message + ' ]')
  }
}

Package.describe({
  summary: "complete npm integration/support for Meteor"
});

Package.on_use(function (api, where) {
  api.add_files(['index.js', 'packages.json'], 'server');
});

Package.on_test(function (api) {
  api.add_files(['index.js', 'test.js'], 'server');
});
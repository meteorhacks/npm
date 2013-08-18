var path = Npm.require('path');
var fs = Npm.require('fs');
var packagesJsonFile = path.resolve('./packages.json');

//creating `packages.json` file for the first-time if not exists
if(!fs.existsSync(packagesJsonFile)) {
  fs.writeFileSync(packagesJsonFile, '{\n  \n}')
}

try {
  var fileContent = fs.readFileSync(packagesJsonFile);
  var packages = JSON.parse(fileContent.toString());
  Npm.depends(packages);
} catch(ex) {
  console.error('ERROR: packages.json parsing error [ ' + ex.message + ' ]');
}

Package.describe({
  summary: "complete npm integration/support for Meteor"
});

Package.on_use(function (api, where) {
  var isNewerMeteor = fs.readFileSync('./.meteor/packages', 'utf8').match(/\nstandard-app-packages/);
  if(isNewerMeteor) {
    api.add_files(['index.js', '../../packages.json'], 'server');
  } else {
    api.add_files(['index.js'], 'server');
  }
});

Package.on_test(function (api) {
  api.add_files(['index.js', 'test.js'], 'server');
});

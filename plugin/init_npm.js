var path = Npm.require('path');
var fs = Npm.require('fs');
var mkdirp = Npm.require('mkdirp');
var echo = Npm.require('node-echo');
var beautify = Npm.require('js-beautify');

var npmContainerDir = path.resolve('./packages/npm-container');
var packagesJsonPath = path.resolve('./packages.json');
var packageJsPath = path.resolve(npmContainerDir, 'package.js');
var indexJsPath = path.resolve(npmContainerDir, 'index.js');

// update for Meteor 1.2
// We need to add package.json file as an static assest for that
if(canProceed() && hasOldPackageJson()) {
  fs.writeFileSync(packageJsPath, getContent(_packageJsContent));
  console.log("\n");
  console.log("-> updated `npm-container` to support Meteor 1.2");
  console.log();
}

if(canProceed() && !fs.existsSync(packagesJsonPath)) {
  console.log('\n');
  console.log("-> creating `packages.json` for the first time.");
  console.log("-> add your npm modules to `packages.json`");
  console.log();

  fs.writeFileSync(packagesJsonPath, '{\n  \n}');
}

if(canProceed() && !fs.existsSync(npmContainerDir)) {
  console.log("=> Creating container package for npm modules");

  // create new npm container directory
  mkdirp.sync(npmContainerDir);
  // add package files
  fs.writeFileSync(indexJsPath, getContent(_indexJsContent));
  fs.writeFileSync(packageJsPath, getContent(_packageJsContent));

  // add new container as a package
  echo.sync("\nnpm-container", ">>", ".meteor/packages");

  console.log();
  console.log("-> npm support has been initialized.")
  console.log("-> please start your app again.");
  console.log();
  // if there is no npm-container when running `meteor`
  // we need to kill the current running process, otherwise
  // dependencies in the packages.json won't get added
  process.exit(0);
}

// check whether is this `meteor test-packages` or not
function canProceed() {
  var unAcceptableCommands = {'test-packages': 1, 'publish': 1};
  if(process.argv.length > 2) {
    var command = process.argv[2];
    if(unAcceptableCommands[command]) {
      return false;
    }
  }

  return true;
}


function hasOldPackageJson() {
  if(!fs.existsSync(packageJsPath)) {
    return false;
  }

  var content = fs.readFileSync(packageJsPath, 'utf8');
  var versionParts = content.match(/version: '(.*)'/);
  if(!versionParts) {
    return false;
  }

  var version = versionParts[1];
  var isOldVersion = version === "1.0.0";
  return isOldVersion;
}

// getContent inside a function
function getContent(func) {
  var lines = func.toString().split('\n');
  // Drop the function declaration and closing bracket
  var onlyBody = lines.slice(1, lines.length -1);
  // Drop line number comments generated by Meteor, trim whitespace, make string
  onlyBody = _.map(onlyBody, function(line) {
    return line.slice(0, line.lastIndexOf("//")).trim();
  }).join('\n');
  // Make it look normal
  return beautify(onlyBody, { indent_size: 2 });
}

// Following function has been defined to just get the content inside them
// They are not executables
function _indexJsContent() {
  Meteor.npmRequire = function(moduleName) {
    var module = Npm.require(moduleName);
    return module;
  };

  Meteor.require = function(moduleName) {
    console.warn('Meteor.require is deprecated. Please use Meteor.npmRequire instead!');
    return Meteor.npmRequire(moduleName);
  };
}

function _packageJsContent () {
  var path = Npm.require('path');
  var fs = Npm.require('fs');

  Package.describe({
    summary: 'Contains all your npm dependencies',
    version: '1.1.0',
    name: 'npm-container'
  });

  var packagesJsonFile = path.resolve('./packages.json');
  try {
    var fileContent = fs.readFileSync(packagesJsonFile);
    var packages = JSON.parse(fileContent.toString());
    Npm.depends(packages);
  } catch(ex) {
    console.error('ERROR: packages.json parsing error [ ' + ex.message + ' ]');
  }

  // Adding the app's packages.json as a used file for this package will get
  // Meteor to watch it and reload this package when it changes
  Package.onUse(function(api) {
    api.add_files('index.js', 'server');
    api.add_files('../../packages.json', 'server', {isAsset: true});
  });
}
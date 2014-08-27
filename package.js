Package.describe({
  summary: "Use npm modules with your Meteor App",
  version: "1.0.0",
  git: "https://github.com/meteorhacks/npm.git",
  name: "meteorhacks:npm"
});

var path = Npm.require('path');
var fs = Npm.require('fs');
var Future = Npm.require('fibers/future');
var exec = Npm.require('child_process').exec;

var npmContainerDir = path.resolve('./packages/local:npm-container');
var packagesJsonPath = path.resolve('./packages.json');

if(!isTestCommand() && !fs.existsSync(packagesJsonPath)) {
  console.log("=> Creating `packages.json` for the first time.");
  console.log("=> Add your npm modules to `packages.json`");

  fs.writeFileSync(packagesJsonPath, '{\n  \n}');
}

if(!isTestCommand() && !fs.existsSync(npmContainerDir)) {
  console.log("=> Creating container package for npm modules");

  var packageJsPath = path.resolve(npmContainerDir, 'package.js');
  var indexJsPath = path.resolve(npmContainerDir, 'index.js');
  execSync("mkdir -p " + npmContainerDir);

  fs.writeFileSync(indexJsPath, getContent(_indexJsContent));
  fs.writeFileSync(packageJsPath, getContent(_packageJsContent));

  execSync("meteor add local:npm-container");
}

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

function execSync(command, options) {
  options = options || {};
  var f = new Future();
  exec(command, options, function(err, stdout, stderr) {
    if(err) {
      throw err;
    } else {
      f.return(stdout);
    }
  });
  return f.wait();
}

// check whether is this `meteor test-packages` or not
function isTestCommand() {
  return process.argv.length > 3 && process.argv[2] == 'test-packages';
}

// getContent inside a function
function getContent(func) {
  var str = func.toString();
  var lines = str.split('\n');
  var onlyBody = lines.slice(1, lines.length -1);
  return onlyBody.join('\n');
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
    version: '1.0.0',
    name: 'local:npm-container'
  });

  var packagesJsonFile = path.resolve('./packages.json');
  try {
    var fileContent = fs.readFileSync(packagesJsonFile);
    var packages = JSON.parse(fileContent.toString());
    Npm.depends(packages);
  } catch(ex) {
    console.error('ERROR: packages.json parsing error [ ' + ex.message + ' ]');
  }

  Package.onUse(function(api) {
    api.add_files(['index.js', '../../packages.json'], 'server');
  });
}
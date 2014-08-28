var path = Npm.require('path');
var fs = Npm.require('fs');
var Future = Npm.require('fibers/future');
var exec = Npm.require('child_process').exec;

var oldNpmPackageDir = path.resolve('./packages/npm');
var npmContainerDir = path.resolve('./packages/npm-container');
var packagesJsonPath = path.resolve('./packages.json');

if(canProceed() && !fs.existsSync(packagesJsonPath)) {
  console.log('\n');
  console.log("-> creating `packages.json` for the first time.");
  console.log("-> add your npm modules to `packages.json`");
  console.log();

  fs.writeFileSync(packagesJsonPath, '{\n  \n}');
}

if(canProceed() && !fs.existsSync(npmContainerDir)) {
  console.log("=> Creating container package for npm modules");

  var packageJsPath = path.resolve(npmContainerDir, 'package.js');
  var indexJsPath = path.resolve(npmContainerDir, 'index.js');
  // create new npm container directory
  execSync("mkdir -p " + npmContainerDir);
  // add package files
  fs.writeFileSync(indexJsPath, getContent(_indexJsContent));
  fs.writeFileSync(packageJsPath, getContent(_packageJsContent));

  // remove old npm package if exists
  execSync("rm -rf " + oldNpmPackageDir);
  // add new container as a package
  execSync('echo "\nnpm-container" >> .meteor/packages');

  console.log();
  console.log("-> npm support has been initialized.")
  console.log("-> please start your app again.");
  console.log();
  process.exit(0);
}

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

  Package.onUse(function(api) {
    api.add_files(['index.js', '../../packages.json'], 'server');
  });
}
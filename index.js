var Future = Npm.require('fibers/future');

Meteor.require = function(moduleName) {
  var module = Npm.require(moduleName);
  return module;
};

Meteor.sync = function(asynFunction) {
  var future = new Future();
  var payload;
  var sent = false;

  setTimeout(function() {
    asynFunction(function(data) {
      if(!sent) {
        payload = data;
        future.ret();
      }
    });
  }, 0);

  future.wait();
  sent = true;
  return payload;
};
var Future = Npm.require('fibers/future');

Meteor.require = function(moduleName) {
  var module = Npm.require(moduleName);
  return module;
};

Meteor.sync = function(asynFunction) {
  var future = new Future();
  var sent = false;
  var payload;

  setTimeout(function() {
    asynFunction(done);
    function done(err, result) {
      if(!sent) {
        payload = {
          result: result,
          error: err
        };
        future.ret();
      }
    }
  }, 0);

  future.wait();
  sent = true;
  
  return payload;
};
var Future = Npm.require('fibers/future');

Meteor.require = function(moduleName) {
  var module = Npm.require(moduleName);
  return module;
};

Meteor.sync = function(asynFunction) {
  var future = new Future();
  var sent = false;
  var payload;
  var error;

  setTimeout(function() {
    asynFunction(done, error);

    function done(data) {
      if(!sent) {
        payload = data;
        future.ret();
      }
    }

    function error(err) {
      if(!sent) {
        error = err;
        future.ret();
      }
    }
  }, 0);

  future.wait();
  sent = true;
  
  if(error) {
    throw new Meteor.Error(error.code || 500, error.message);
  } else {
    return payload;
  }
};
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

        if(future.ret) {
          //for 0.6.4.1 and older
          future.ret();
        } else {
          //for 0.6.5 and newer
          future.return();
        }
      }
    }
  }, 0);

  future.wait();
  sent = true;
  
  return payload;
};

var Future = Npm.require('fibers/future');
Async = {};

Meteor.require = function(moduleName) {
  var module = Npm.require(moduleName);
  return module;
};

Async.runSync = Meteor.sync = function(asynFunction) {
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

Async.wrap = function(arg1, arg2) {
  if(typeof arg1 == 'function') {
    var func = arg1;
    return wrapFunction(func);
  } else if(typeof arg1 == 'object' && typeof arg2 == 'string') {
    var obj = arg1;
    var funcName = arg2;
    return wrapObject(obj, [funcName])[funcName];
  } else if(typeof arg1 == 'object' &&  arg2 instanceof Array) {
    var obj = arg1;
    var funcNameList = arg2;
    return wrapObject(obj, funcNameList);
  } else {
    throw new Error('unsupported argument list');
  }

  function wrapObject(obj, funcNameList) {
    var returnObj = {};
    funcNameList.forEach(function(funcName) {
      if(obj[funcName]) {
        var func = obj[funcName].bind(obj);
        returnObj[funcName] = wrapFunction(func);
      } else {
        throw new Error('instance method not exists: ' + funcName);
      }
    });
    return returnObj;
  }

  function wrapFunction(func) {
    return function() {
      var args = arguments;
      response = Meteor.sync(function(done) {
        Array.prototype.push.call(args, done);
        func.apply(null, args);
      });

      if(response.error) {
        throw response.error;
      } else {
        return response.result;
      }
    };
  }
};

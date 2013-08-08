# Complete NPM integration for Meteor [![Build Status](https://travis-ci.org/arunoda/meteor-npm.png?branch=master)](https://travis-ci.org/arunoda/meteor-npm)

See MeteorHacks article on [Complete NPM integration for Meteor](http://meteorhacks.com/complete-npm-integration-for-meteor.html)

### Adding NPM support to your app

    mrt add npm

### Create packages.json file for listing dependencies.

    {
      "redis": "0.8.2",
      "github": "0.1.8"
    }

### Example on using npm module inside a Meteor method

~~~js
if (Meteor.isClient) {
  getGists = function getGists(user, callback) {
    Meteor.call('getGists', user, callback);
  }
}

if (Meteor.isServer) {
  Meteor.methods({
    'getGists': function getGists(user) {
      var GithubApi = Meteor.require('github');
      var github = new GithubApi({
          version: "3.0.0"
      });

      var gists = Meteor.sync(function(done) {
        github.gists.getFromUser({user: 'arunoda'}, function(err, data) {
          done(null, data);
        });
      });

      return gists.result;
    }
  });
}
~~~

## API

### Meteor.require(npmModuleName)
> Available in the Server Side only

This method loads NPM modules you've specified in the `packages.json` file.

~~~
var Github = Meteor.require('github');
~~~

### Meteor.sync(func)
> Available in the Server Side only

Meteor APIs are executed synchronously. Most of the NodeJS modules works asynchronously. So we need a way to bride the gap. `Meteor.sync()` does that.

`Meteor.sync()` pause the execution until you invoke `done()` callback as shown below.

~~~
var response = Meteor.sync(function(done) {
  setTimeout(function() { 
    done(null, 1001);
  }, 100);
});

console.log(response.result); // 1001
~~~

`done()` callback takes 2 arguments. error and the result object. You can get them as the return value of the `Meteor.sync()` as shown as response in the above example.

return value is an object and it has 2 fields. `error` and `response`.




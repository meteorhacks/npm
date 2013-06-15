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
          done(data);
        });
      });

      return gists;
    }
  });
}
~~~

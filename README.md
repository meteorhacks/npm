# Use Npm Modules with Your Meteor App

> ### Using With Meteor 1.3
> Meteor 1.3 has the build in NPM support. So, in Meteor 1.3 this package won't add anything.
> #### Migration Guide 
> If your app use this package, follow these steps to migrate into 1.3.
> * Create a `package.json` in your app. Use: `npm init`.
> * Move all the packages on `packages.json` into `package.json` dependencies.
> * Then do a `npm install` to install those NPM module.
> * Remove `meteorhacks:npm` from your app with: `meteor remove meteorhacks:npm`.
> * Remove `npm-container` from your app with: `meteor remove npm-container`.
> * If you use Async methods introduced by this package, use [`meteorhacks:async`](https://atmospherejs.com/meteorhacks/async) package directly.

With Meteor you only can use `npm` modules inside packages. You can't directly use `npm` modules with meteor apps. This package solves that issue :)

## Installation

```
meteor add meteorhacks:npm
```

Then start your app with `meteor` and follow the instructions.

## Defining Packages

Once npm support has been initialized, you'll have a file name called `packages.json` inside your app. Define packages in that file as shown below.

~~~json
{
  "redis": "0.8.2",
  "github": "0.1.8"
}
~~~

> You must define an absolute version number for the npm module

If you need to install an npm module from a specific commit, use the syntax:

~~~json
{
  "googleapis": "https://github.com/bradvogel/google-api-nodejs-client/archive/d945dabf416d58177b0c14da64e0d6038f0cc47b.tar.gz"
}
~~~
The above can be generated using [github releases](https://github.com/blog/1547-release-your-software). You're going to want to use `<commit hash>.tar.gz` version, not `archive/<version number>.tar.gz`.

## Using Packages

You can use `Meteor.npmRequire` method to access the npm module on server side and use it as you want. 
Most of the npm modules provide asynchronous API's with callbacks or promises. So, you can't directly use them with Meteor. Because of that, this package comes with a handy set of Async utilities make your life easier. 

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
      var GithubApi = Meteor.npmRequire('github');
      var github = new GithubApi({
          version: "3.0.0"
      });

      var gists = Async.runSync(function(done) {
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
> Available in the Server Side only

#### Meteor.npmRequire(npmModuleName)

This method loads NPM modules you've specified in the `packages.json` file.

~~~js
var Github = Meteor.npmRequire('github');
~~~

#### Meteor.require(npmModuleName)
Same as above. But **deprecated**.

## Async Utilities
> Available in the Server Side only
> Async Utitlies is available as a separate package via [`meteorhacks:async`](https://github.com/meteorhacks/meteor-async)

Meteor APIs are executed synchronously. Most of the NodeJS modules works asynchronously. 
So we need a way to bride the gap. Async Utilities comes to rescue you.

### Async.runSync(function) 

`Async.runSync()` pause the execution until you invoke `done()` callback as shown below.

~~~js
var response = Async.runSync(function(done) {
  setTimeout(function() { 
    done(null, 1001);
  }, 100);
});

console.log(response.result); // 1001
~~~

`done()` callback takes 2 arguments. `error` and the `result` object. You can get them as the return value of the `Async.runSync()` as shown as response in the above example.

return value is an object and it has 2 fields. `error` and `result`.

### Meteor.sync(function)

Same as `Async.runSync` but deprecated. 

### Async.wrap(function) 

Wrap an asynchronous function and allow it to be run inside Meteor without callbacks.

~~~js

//declare a simple async function
function delayedMessage(delay, message, callback) {
  setTimeout(function() {
    callback(null, message);
  }, delay);
}

//wrapping
var wrappedDelayedMessage = Async.wrap(delayedMessage);

//usage
Meteor.methods({
  'delayedEcho': function(message) {
    var response = wrappedDelayedMessage(500, message);
    return response;
  }
});
~~~

If the callback has a result, it will be returned from the wrapped function. If there is an error, it will be thrown.

> `Async.wrap(function)` is very similar to `Meteor._wrapAsync`. 

### Async.wrap(object, functionName)

Very similar to `Async.wrap(function)`, 
but this API can be used to wrap an instance method of an object.

~~~js
var github = new GithubApi({
    version: "3.0.0"
});

//wrapping github.user.getFrom
var wrappedGetFrom = Async.wrap(github.user, 'getFrom');
~~~

### Async.wrap(object, functionNameList)

Very similar to `Async.wrap(object, functionName)`, 
but this API can be used to wrap **multiple** instance methods of an object.

~~~js
var github = new GithubApi({
    version: "3.0.0"
});

//wrapping github.user.getFrom and github.user.getEmails
var wrappedGithubUser = Async.wrap(github.user, ['getFrom', 'getEmails']);

//usage
var profile = wrappedGithubUser.getFrom('arunoda');
var emails = wrappedGithubUser.getEmails();
~~~

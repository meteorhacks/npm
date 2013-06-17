Tinytest.add('Meteor.sync with done()', function(test) {
  var output = Meteor.sync(function(done) {
    setTimeout(function() {
      done(null, 10001);
    }, 10);
  });

  test.equal(output.result, 10001);
  test.equal(output.error, null);
});

Tinytest.add('Meteor.sync with error()', function(test) {
  
  var output = Meteor.sync(function(done) {
    setTimeout(function() {
      done({message: 'error-message', code: 402});
    }, 10);
  });

  test.equal(output.result, undefined);
  test.equal(output.error.code, 402);
});
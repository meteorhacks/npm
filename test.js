Tinytest.add('Meteor.sync with done()', function(test) {
  var result = Meteor.sync(function(done) {
    setTimeout(function() {
      done(10001);
    }, 10);
  });

  test.equal(result, 10001);
});

Tinytest.add('Meteor.sync with error()', function(test) {
  
  var result = Meteor.sync(function(done, error) {
    setTimeout(function() {
      error({message: 'error-message', code: 402});
    }, 10);
  });

  test.equal(result, undefined);

});
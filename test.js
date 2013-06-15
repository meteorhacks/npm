Tinytest.add('Meteor.sync', function(test) {
  var result = Meteor.sync(function(done) {
    setTimeout(function() {
      done(10001);
    }, 10);
  });

  test.equal(result, 10001);
});
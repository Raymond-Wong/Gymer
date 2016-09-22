$(document).ready(function() {
  doSaveAction();
});

var doSaveAction = function() {
  $('button[type="submit"]').on('tap', function() {
    var params = {};
    params['height'] = $('input[name="height"]').val();
    params['weight'] = $('input[name="weight"]').val();
    params['age'] = $('input[name="age"]').val();
    params['gender'] = $('input[name="gender"]').val();
    params['exercise_level'] = $('input[name="exercise_level"]').val();
    post('/user?action=set', params, function(msg) {
      alert(msg);
    });
  });
  
}
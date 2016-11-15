$(document).ready(function() {
  doLoginAction();
  doSignUpAction();
});

var doLoginAction = function() {
  $('button[type="signIn"]').tap(function() {
    var params = {};
    params['account'] = $('input[name="account"]').val();
    params['password'] = $('input[name="password"]').val();
    post('/user?action=login', params, function(msg) {
      window.location.href = '/meal?action=list';
    });
  });
}

var doSignUpAction = function() {
  $('button[type="signUp"]').tap(function() {
    window.location.href = "/user?action=register";
  });
}

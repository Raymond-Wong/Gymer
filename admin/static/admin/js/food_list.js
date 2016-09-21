$(document).ready(function() {
  addFoodAction();
  deleteFoodAction();
});

// 添加食物
var addFoodAction = function() {
  $('#addFoodBtn').click(function() {
    var params = {};
    params['category'] = $('input[name="category"]').val();
    params['name'] = $('input[name="name"]').val();
    params['calorie'] = $('input[name="calorie"]').val();
    params['GI'] = $('input[name="GI"]').val();
    post('/admin/food?action=add', params, function(msg) {
      window.location.href = window.location.href;
    });
  });
}

// 删除食物
var deleteFoodAction = function() {
  $('.deleteFoodBtn').click(function() {
    var tr = $(this).parent().parent();
    var params = {};
    params['id'] = $(tr.children('td')[0]).text();
    post('/admin/food?action=delete', params, function(msg) {
      alert('删除成功');
      tr.remove();
    });
  });
}
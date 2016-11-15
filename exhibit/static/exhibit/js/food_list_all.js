$(document).ready(function() {
  addFoodAction();
  removeFoodAction();
  initSwipeAction();
  chooseTypeAction();
  queryByName();
});

var queryByName = function() {
  $('.searchBox input').bind('input propertychange', function() {
    var searchName = $(this).val();
    $('.foodBox').each(function() {
      var swipeWrapper = $(this).parent().parent();
      var thisName = $(this).children('.foodInfo').children('.foodName').attr('value');
      if (thisName.startWith(searchName)) {
        swipeWrapper.show();
      } else {
        swipeWrapper.hide();
      }
    });
  });
}

var chooseTypeAction = function() {
  $('.typeSelect').change(function() {
    var choosenType = $(this).children('option:selected').text();
    $('.foodBox').each(function() {
      var swipeWrapper = $(this).parent().parent();
      var thisType = $(this).children('.foodInfo').children('.foodCategory').attr('value');
      if (thisType != choosenType) {
        swipeWrapper.hide();
      } else {
        swipeWrapper.show();
      }
    });
  });
}

var initSwipeAction = function() {
  $('.swipeWrapper').each(function() {
    var scroller = new IScroll(this, {snap: true, scrollX: true, scrollY: false, mouseWheel: true, eventPassthrough: true});
  });
}

var addFoodAction = function() {
  var addFoodBtns = $('.addFoodBtn');
  $(document).delegate('.addFoodBtn', 'tap', function() {    
    var btn = $(this);
    var foodBox = btn.parent().children('.foodBox')
    var params = {};
    params['fid'] = foodBox.attr('fid');
    post('/food?action=add', params, function(msg) {
      var swipeWrapper = $($(foodBox.parents('.swipeWrapper'))[0]);
      swipeWrapper.children('.foodOptionBtn').text('移除');
      swipeWrapper.children('.foodOptionBtn').attr('type', 'remove');
      btn.removeClass('addFoodBtn');
      btn.addClass('removeFoodBtn');
      alert(msg);
    });
  });
}

var removeFoodAction = function() {
  var removeFoodBtns = $('.removeFoodBtn');
  $(document).delegate('.removeFoodBtn', 'tap', function() {
    var btn = $(this);
    var foodBox = btn.parent().children('.foodBox')
    var params = {};
    params['fid'] = foodBox.attr('fid');
    post('/food?action=remove', params, function(msg) {
      var swipeWrapper = $($(foodBox.parents('.swipeWrapper'))[0]);
      swipeWrapper.children('.foodOptionBtn').text('添加');
      swipeWrapper.children('.foodOptionBtn').attr('type', 'add');
      btn.removeClass('removeFoodBtn');
      btn.addClass('addFoodBtn');
      alert(msg);
    });
  });
}
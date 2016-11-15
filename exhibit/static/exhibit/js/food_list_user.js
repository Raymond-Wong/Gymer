$(document).ready(function() {
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

var removeFoodAction = function() {
  var removeFoodBtns = $('.removeFoodBtn');
  $(document).delegate('.removeFoodBtn', 'tap', function() {
    var btn = $(this);
    var foodBox = btn.parent().children('.foodBox')
    var params = {};
    params['fid'] = foodBox.attr('fid');
    post('/food?action=remove', params, function(msg) {
      var swipeWrapper = $($(foodBox.parents('.swipeWrapper'))[0]);
      swipeWrapper.remove();
      alert(msg);
    });
  });
}
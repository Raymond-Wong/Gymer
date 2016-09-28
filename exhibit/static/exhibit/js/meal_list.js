$(document).ready(function() {
  initMonthChooser();
  initDayChooser();
  initChangeDateAction();
  initMainScroller();
  randomAddMealAction();
  exactAddMealAction();
  updateMealAction();
  removeFoodAction();
  deleteMealAction();
  changeAmountAction();
  initSwipeDelete();
  queryFoodAction();
  cancelChooseFoodAction();
  chooseFoodAction();
});

var initMainScroller = function() {
  var wrapper = $('.mainScrollerWrapper');
  var scroller = $('.mainScroller');
  var addMealWrapper = $('.addMealWrapper');
  var startY = addMealWrapper.height() + 2 * parseFloat(addMealWrapper.css('padding'));
  var totalHeight = $(window).height() - 14 * 3 - $(window).width() * 13 / 100;
  wrapper.css('height', totalHeight + 'px');
  scroller.css('min-height', totalHeight + startY + 'px');
  // wrapper.css('height', startY + 'px');
  var iscroll = new IScroll(wrapper[0], {snap: false, startY: -1 * startY, mouseWheel: true, eventPassthrough: false})
  // iscroll.on('scrollEnd', function() {
  //   if (Math.abs(this.y) > (startY / 3) && Math.abs(this.y) < startY) {
  //     iscroll.scrollTo(0, -1 * startY, 500);
  //   } else if (Math.abs(this.y) < (startY / 3) && this.y <= 0) {
  //     iscroll.scrollTo(0, 0, 500);
  //   }
  // });
}

var cancelChooseFoodAction = function() {
  $('.chooseFoodCancelBtn').on('tap', function() {
    $('.chooseFoodWrapper').fadeOut();
  });
}

var chooseFoodAction = function() {
  $('.addFoodBtn').on('tap', function() {
    var mealWrapper = $($(this).parents('.mealWrapper')[0]);
    var chooseFoodWrapper = $('.chooseFoodWrapper');
    queryFood('');
    chooseFoodWrapper.attr('mid', mealWrapper.attr('mid'));
    chooseFoodWrapper.fadeIn();
  });
}

var queryFood = function(foodName) {
  var chooseFoodResultBox = $('.chooseFoodResultBox');
  var chooseFoodHint = $('.chooseFoodHint');
  post('/food?action=queryByName', {'name' : foodName}, function(msg) {
    chooseFoodResultBox.empty();
    var foods = $.parseJSON(msg);
    if (foods.length == 0) {
      chooseFoodHint.text('食物库中未查询到任何食物,请重新查询');
      return false;
    }
    chooseFoodHint.text('查询到 ' + foods.length + ' 个食物, 请选择:');
    for (var i = 0; i < foods.length; i++) {
      var food = foods[i]['fields'];
      food['id'] = foods[i]['pk'];
      var newFoodBox = $(chooseFoodBox);
      newFoodBox.attr('fid', food['id']);
      $(newFoodBox.find('.foodName .foodInfoText')[0]).text(food['name']);
      $(newFoodBox.find('.foodCalorie .foodInfoText')[0]).text(food['calorie']);
      $(newFoodBox.find('.foodGI .foodInfoText')[0]).text(food['GI']);
      newFoodBox.bind('tap', function() {
        addFoodAction($(this));
      });
      chooseFoodResultBox.append(newFoodBox);
    }
  });
}

var addFoodAction = function(chooseFoodBox) {
  var mid = $('.chooseFoodWrapper').attr('mid');
  var mealWrapper = $('.mealWrapper[mid="' + mid + '"]');
  var newFoodWrapper = $(foodBox);
  var newFoodBox = newFoodWrapper.find('.foodBox');
  var fid = chooseFoodBox.attr('fid');
  var fname = chooseFoodBox.find('.foodName').text();
  var fcalorie = chooseFoodBox.find('.foodCalorie').text();
  var fgi = chooseFoodBox.find('.foodGI').text();
  newFoodBox.attr('fid', fid);
  newFoodBox.find('.foodName').text(fname);
  newFoodBox.find('.foodCalorie').text(fcalorie);
  newFoodBox.find('.foodGI').text(fgi);
  mealWrapper.children('.foodList').append(newFoodWrapper);
  new IScroll(newFoodWrapper[0], {snap: true, scrollX: true, scrollY: false, mouseWheel: true, eventPassthrough: true});
  $('.chooseFoodWrapper').fadeOut();
}

var queryFoodAction = function() {
  $('.chooseFoodName').bind('input propertychange', function() {
    queryFood($(this).val());
  });
}

var initSwipeDelete = function() {
  $('.swipeWrapper').each(function() {
    var scroller = new IScroll(this, {snap: true, scrollX: true, scrollY: false, mouseWheel: true, eventPassthrough: true});
    // var that = $(this);
    // $(that.find('.foodBox')[0]).on('tap', function() {
    //   scroller.scrollToElement(this);
    // });
  });
}

var changeAmountAction = function() {
  $(document).delegate('.minusAmountBtn, .addAmountBtn', 'tap', function() {
    var target = $($(this).parent().find('.foodAmountVal')[0]);
    var diff = parseInt($(this).attr('diff'));
    target.val(parseInt(target.val()) + diff);
  });
}

var initChangeDateAction = function() {
  $('.dayBox').on('tap', function() {
    var year = $('.metaInfo').attr('year');
    var month = $('.month.active').attr('value');
    var day = $(this).attr('value');
    window.location.href = '/meal?action=list&year=' + year + '&month=' + month + '&day=' + day;
  });
  $('.month').on('tap', function() {
    var year = $('.metaInfo').attr('year');
    var month = $(this).attr('value');
    var day = "1";
    window.location.href = '/meal?action=list&year=' + year + '&month=' + month + '&day=' + day;
  });
}

MONTH_CHOOSER = null;
var initMonthChooser = function() {
  var month = $('.metaInfo').attr('month');
  MONTH_CHOOSER = new IScroll(".monthBoxWrapper", {scrollX: true, scrollY: false, mouseWheel: true, eventPassthrough: true});
  $('.monthArrowBox').bind('tap', function() {
    var activeDom = $('.month.active');
    var offset = $(this).attr('side') == 'left' ? -1 : +1;
    var activeMonth = parseInt(activeDom.attr('value')) + offset;
    if (activeMonth <= 12 && activeMonth >= 1) {
      var toActiveDom = $('.month[value="' + activeMonth + '"]');
      toActiveDom.trigger('tap');
    }
    return false;
  });
  var activeMonthDom = $('.month[value="' + month + '"]');
  activeMonthDom.addClass('active');
  MONTH_CHOOSER.scrollToElement(activeMonthDom[0], 1000);
}

DAY_CHOOSER = null;
var initDayChooser = function() {
  var day = parseInt($('.metaInfo').attr('day'));
  var month = parseInt($('.metaInfo').attr('month'));
  var year = parseInt($('.metaInfo').attr('month'));
  var daysAmount = (new Date(year, month, 0)).getDate();
  var newDayStr = '<li class="dayBox"></li>';
  var dayWrapper = $('.dayWrapper');
  var wrapperW = 14.5 * daysAmount + 'vw';
  for (var i = 0; i < daysAmount; i++) {
    var newDayBox = $(newDayStr);
    newDayBox.attr('value', i + 1);
    newDayBox.text(i + 1);
    dayWrapper.append(newDayBox);
  }
  dayWrapper.css('width', wrapperW);
  var activeDayDom = $('.dayBox[value="' + day + '"]');
  var scrollDom = $('.dayBox[value="' + (day - 3) + '"]');
  activeDayDom.addClass('active');
  DAY_CHOOSER = new IScroll('.dayContainer', {scrollX: true, scrollY: false, mouseWheel: false, eventPassthrough: true});
  if (scrollDom.length > 0) {
    DAY_CHOOSER.scrollToElement(scrollDom[0], 1000);
  } else {
    DAY_CHOOSER.scrollToElement(activeDayDom[0], 1000);
  }
}

var deleteMealAction = function() {
  $('.deleteMealBtn').bind('tap', function() {
    var params = {};
    var mealWrapper = $($(this).parents('.mealWrapper')[0]);
    params['mid'] = mealWrapper.attr('mid');
    post('/meal?action=delete', params, function(msg) {
      mealWrapper.remove();
      alert(msg);
    });
  });
}

var exactAddMealAction = function() {
  var year = $('.metaInfo').attr('year');
  var month = $('.metaInfo').attr('month');
  var day = $('.metaInfo').attr('day');
  $('.exactAddBtn').bind('tap', function() {
    var params = {};
    params['year'] = year;
    params['month'] = month;
    params['day'] = day;
    params['fids'] = JSON.stringify($('input[name="fids"]').val().split(','));
    params['name'] = $('input[name="name"]').val();
    post('/meal?action=add&type=exact', params, function(msg) {
      alert(msg);
    });
  });
}

var randomAddMealAction = function() {
  var year = $('.metaInfo').attr('year');
  var month = $('.metaInfo').attr('month');
  var day = $('.metaInfo').attr('day');
  $('.randomAddBtn').bind('tap', function() {
    var params = {};
    params['year'] = year;
    params['month'] = month;
    params['day'] = day;
    params['food_types'] = JSON.stringify($('input[name="food_types"]').val().split(','));
    params['name'] = $('input[name="name"]').val();
    post('/meal?action=add&type=random', params, function(msg) {
      alert(msg);
    });
  });
}

var updateMealAction = function() {
  $('.updateMealBtn').on('tap', function() {
    var mealWrapper = $($(this).parents('.mealWrapper')[0])
    var foods = [];
    var foodDoms = mealWrapper.find('.foodBox');
    for (var i = 0; i < foodDoms.length; i++) {
      var foodDom = $(foodDoms[i]);
      var fid = foodDom.attr('fid');
      var amount = $(foodDom.find('.foodAmountVal')[0]).val();
      foods.push([fid, amount]);
    }
    var params = {};
    params['foods'] = JSON.stringify(foods);
    params['mid'] = mealWrapper.attr('mid');
    post('/meal?action=update', params, function(msg) {
      alert(msg);
    });
  });
}

var removeFoodAction = function() {
  $('.deleteFoodWindow').on('tap', function() {
    var row = $($(this).parents('.swipeWrapper')[0]);
    row.remove();
    return false;
  });
}
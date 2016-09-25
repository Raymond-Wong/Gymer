$(document).ready(function() {
  initMonthChooser();
  initDayChooser();
  initChangeDateAction();
  randomAddMealAction();
  exactAddMealAction();
  updateMealAction();
  removeFoodAction();
  addFoodsAction();
  deleteMealAction();
  changeAmountAction();
  initSwipeDelete();
});

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
  $('.minusAmountBtn, .addAmountBtn').on('tap', function() {
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

var addFoodsAction = function() {
  $('.addFoodsBtn').bind('tap', function() {
    var table = $($(this).parent().find('table')[0]).children();
    var trs = table.children('tr');
    var foods = [];
    var addFoodsId = $($(this).parent().find('input[name="addFoodsId"]')[0]).val().split(',');
    for (var i = 0; i < trs.length; i++) {
      var tr = $(trs[i]);
      if (tr.children('th').length == 0) {
        var idBox = $(tr.children('td')[0]);
        var amountBox = $(tr.find('input[name="amount"]')[0]);
        foods.push([idBox.text(), amountBox.val()]);
      }
    }
    for (var i = 0; i < addFoodsId.length; i++) {
      foods.push([addFoodsId[i], '0']);
    }
    var mealId = $($(this).parents('.panel')[0]).attr('mid');
    var params = {};
    params['foods'] = JSON.stringify(foods);
    params['mid'] = mealId;
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
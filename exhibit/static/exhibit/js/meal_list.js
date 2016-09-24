$(document).ready(function() {
  initMonthChooser();
  randomAddMealAction();
  exactAddMealAction();
  updateMealAction();
  removeFoodAction();
  addFoodsAction();
  deleteMealAction();
});

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
      activeDom.removeClass('active');
      MONTH_CHOOSER.scrollToElement(toActiveDom[0], 1000);
      toActiveDom.addClass('active');
    }
    return false;
  });
  $('.month').bind('tap', function() {
    var activeDom = $('.month.active');
    if (activeDom) {
      activeDom.removeClass('active');
      $(this).addClass('active');
      MONTH_CHOOSER.scrollToElement(this, 1000);
    }
    return false;
  });
  $('.month[value="' + month + '"]').trigger('tap');
}

var deleteMealAction = function() {
  $('.deleteMealBtn').bind('tap', function() {
    var params = {};
    params['mid'] = $(this).parent().parent().attr('mid');
    post('/meal?action=delete', params, function(msg) {
      alert(msg);
    });
  });
}

var exactAddMealAction = function() {
  var year = $('h1').attr('year');
  var month = $('h1').attr('month');
  var day = $('h1').attr('day');
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
  var year = $('h1').attr('year');
  var month = $('h1').attr('month');
  var day = $('h1').attr('day');
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
    var table = $($(this).parent().find('table')[0]).children();
    var trs = table.children('tr');
    var foods = [];
    for (var i = 0; i < trs.length; i++) {
      var tr = $(trs[i]);
      if (tr.children('th').length == 0) {
        var idBox = $(tr.children('td')[0]);
        var amountBox = $(tr.find('input[name="amount"]')[0]);
        foods.push([idBox.text(), amountBox.val()]);
      }
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
  $('.removeFoodBtn').bind('tap', function() {
    var tr = $(this).parent().parent();
    tr.remove();
    return false;
  });
}
var chooseFoodBox = '' +
      '<div class="foodBox left" fid="1">' +
        '<div class="thumbImg foodImg"></div>' +
        '<div class="foodInfo">' +
          '<div class="foodName">名称：&nbsp;&nbsp;&nbsp;&nbsp;<font class="foodInfoText"></font></div>' +
          '<div class="foodCalorie">卡路里：<font class="foodInfoText"></font></div>' +
          '<div class="foodGI">GI值：&nbsp;&nbsp;&nbsp;&nbsp;<font class="foodInfoText"></font></div>' +
        '</div>' +
      '</div>';

var foodBox = '' +
    '<div class="swipeWrapper">' +
      '<div class="swipeBox">' +
        '<div class="foodBox left" fid="{{ rs.food.id }}">' +
          '<div class="thumbImg foodImg"></div>' +
          '<div class="foodInfo">' +
            '<div class="foodName">名称：&nbsp;&nbsp;&nbsp;&nbsp;{{ rs.food.name }}</div>' +
            '<div class="foodCalorie">卡路里：{{ rs.food.calorie }}</div>' +
            '<div class="foodGI">GI值：&nbsp;&nbsp;&nbsp;&nbsp;{{ rs.food.GI }}</div>' +
            '<div class="foodAmount">' +
              '<div class="minusAmountBtn btn left" diff="-5">-</div>' +
              '<input class="left foodAmountVal" type="number" min="0" value="0" />' +
              '<div class="addAmountBtn btn right" diff="5">+</div>' +
              '<div class="clear"></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<a class="deleteFoodWindow left"></a>' +
        '<div class="clear"></div>' +
      '</div>' +
      '<div class="deleteFoodBtn">删除</div>' +
    '</div>';
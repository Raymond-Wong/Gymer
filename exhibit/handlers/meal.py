# -*- coding: utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf-8')
import random
import datetime
import json

from django.http import HttpResponse, HttpResponseServerError, Http404
from django.shortcuts import render, redirect
from django.utils import timezone

import Gymer.utils
from Gymer.utils import Response, get_post_args
from Gymer.models import User, Meal, RS_Food_Amount
from exhibit.utils import user_to_foods

def list(request):
  now = timezone.now()
  user = User.objects.get(id=request.session['uid'])
  year = request.GET.get('year', str(now.year))
  month = request.GET.get('month', str(now.month))
  day = request.GET.get('day', str(now.day))
  meals = Meal.objects.filter(date__year=year).filter(date__month=month).filter(date__day=day)
  return render(request, 'exhibit/meal_list.html', {'meals' : meals, 'year' : year, 'month' : month, 'day' : day})

def add(request):
  add_type = request.GET.get('type', 'random')
  if add_type == 'random':
    return random_add_meal(request)
  return exact_add_meal(request)

def random_add_meal(request):
  args = [('food_types', True, str, '', 100000), ('name', True, str, '未定义', 50), ('year', True, int, -1), ('month', True, int, -1), ('day', True, int, -1)]
  args = get_post_args(request.POST, args)
  if not args[0]:
    return HttpResponse(Response(m='get args error: %s' % args[1], c='-1').toJson(), content_type='application/json')
  args = args[1]
  user = User.objects.get(id=request.session['uid'])
  # 创建新的一餐
  newMeal = Meal(date=datetime.date(args['year'], args['month'], args['day']))
  newMeal.name = args['name']
  newMeal.user = user
  newMeal.save()
  FOOD_TYPE = map(lambda x:x.strip(), json.loads(args['food_types']))
  # 设置该餐中的食物
  for food_type in FOOD_TYPE:
    foods = user_to_foods(user, food_type)
    if len(foods) > 0:
      food = random.choice(foods)
      food_amount = RS_Food_Amount(food=food, meal=newMeal, amount=0)
      food_amount.save()
  return HttpResponse(Response(m='随机生成成功').toJson(), content_type='application/json')



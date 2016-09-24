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
from Gymer.models import User, Meal, RS_Food_Amount, Food
from exhibit.utils import user_to_foods, meal_to_foods, get_meal_calorie_GI

def list(request):
  user = User.objects.get(id=request.session['uid'])
  now = timezone.now()
  user = User.objects.get(id=request.session['uid'])
  year = request.GET.get('year', str(now.year))
  month = request.GET.get('month', str(now.month))
  day = request.GET.get('day', str(now.day))
  meals = Meal.objects.filter(user=user).filter(date__year=year).filter(date__month=month).filter(date__day=day)
  return render(request, 'exhibit/meal_list.html', {'meals' : meals, 'year' : year, 'month' : month, 'day' : day})

def add(request):
  add_type = request.GET.get('type', 'random')
  if add_type == 'random':
    return random_add_meal(request)
  return exact_add_meal(request)

def exact_add_meal(request):
  args = [('fids', True, str, '[]', 100000), ('name', True, str, '未定义', 50), ('year', True, int, -1), ('month', True, int, -1), ('day', True, int, -1)]
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
  fids = map(lambda x:x.strip(), json.loads(args['fids']))
  # 设置该餐中的食物
  for fid in fids:
    food = Food.objects.get(id=fid)
    food_amount = RS_Food_Amount(food=food, meal=newMeal, amount=0)
    food_amount.save()
  return HttpResponse(Response(m='随机生成成功').toJson(), content_type='application/json')

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
    if food_type == '':
      continue
    foods = user_to_foods(user, food_type)
    if len(foods) > 0:
      food = random.choice(foods)
      food_amount = RS_Food_Amount(food=food, meal=newMeal, amount=0)
      food_amount.save()
  return HttpResponse(Response(m='随机生成成功').toJson(), content_type='application/json')

def update(request):
  args = [('foods', True, str, '[]', 100000), ('mid', True, long, -1)]
  args = get_post_args(request.POST, args)
  if not args[0]:
    return HttpResponse(Response(m='get args error: %s' % args[1], c='-1').toJson(), content_type='application/json')
  args = args[1]
  meal = None
  try:
    meal = Meal.objects.get(id=args['mid'])
  except:
    return HttpResponse(Response(m='query meal not exist: %s' % args['mid'], c='-2').toJson(), content_type='application/json')
  newFoods = json.loads(args['foods'])
  fa_set = []
  for food in newFoods:
    r_food = Food.objects.get(id=food[0])
    food_amount = food[1]
    rs_food_amount = meal.rs_food_amount_set.filter(food=r_food).filter(meal=meal)
    if len(rs_food_amount) > 0:
      rs_food_amount = rs_food_amount[0]
    else:
      rs_food_amount = RS_Food_Amount(food=r_food, meal=meal)
    rs_food_amount.amount = food_amount
    rs_food_amount.save()
    fa_set.append(rs_food_amount.id)
  # 将多于的rs_food_amount删除
  for fa in meal.rs_food_amount_set.all():
    if fa.id not in fa_set:
      fa.delete()
  # 计算一餐的卡路里
  meal.calorie, meal.GI = get_meal_calorie_GI(meal)
  meal.save()
  return HttpResponse(Response(m='更新餐信息成功').toJson(), content_type="application/json")

def delete(request):
  user = User.objects.get(id=request.session['uid'])
  args = [('mid', True, long, -1)]
  args = get_post_args(request.POST, args)
  if not args[0]:
    return HttpResponse(Response(m='get args error: %s' % args[1], c='-1').toJson(), content_type='application/json')
  args = args[1]
  meal = None
  try:
    meal = Meal.objects.get(id=args['mid'])
  except:
    return HttpResponse(Response(m='query meal not exist: %s' % args['mid'], c='-2').toJson(), content_type='application/json')
  if (user != meal.user):
    return HttpResponse(Response(m='待删除餐不输入当前登陆用户', c='1').toJson(), content_type='application/json')
  meal.delete()
  return HttpResponse(Response(m='删除成功').toJson(), content_type='application/json')


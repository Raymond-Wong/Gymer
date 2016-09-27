# -*- coding: utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf-8')
from django.http import HttpResponse, HttpResponseServerError, Http404
from django.shortcuts import render, redirect
from django.core import serializers

import Gymer.utils
from Gymer.utils import Response, get_post_args
from Gymer.models import Food, User, RS_Preference
from exhibit.utils import food_to_users, user_to_foods

def list(request):
  list_type = request.GET.get('type', 'all')
  if list_type == 'all':
    return list_all(request)
  return list_user(request)

def list_all(request):
  user = User.objects.get(id=request.session['uid'])
  foods = Food.objects.all()
  for food in foods:
    if user in food_to_users(food):
      food.belong_to = True
    else:
      food.belong_to = False
  return render(request, 'exhibit/food_list_all.html', {'foods' : foods})

def list_user(request):
  user = User.objects.get(id=request.session['uid'])
  foods = user_to_foods(user)
  for food in foods:
    food.preference = RS_Preference.objects.filter(food=food, market=user.market)[0].preference
    food.belong_to = True
  return render(request, 'exhibit/food_list_user.html', {'foods' : foods})

def add(request):
  user = User.objects.get(id=request.session['uid'])
  args = [('fid', True, long, -1)]
  args = get_post_args(request.POST, args)
  if not args[0]:
    return HttpResponse(Response(m='get args error: %s' % args[1], c='-1').toJson(), content_type='application/json')
  args = args[1]
  food = None
  try:
    food = Food.objects.get(id=args['fid'])
  except:
    return HttpResponse(Response(m='query food not exist: %s' % args['fid'], c='-2').toJson(), content_type='application/json')
  if len(RS_Preference.objects.filter(food=food).filter(market=user.market)) > 0:
    return HttpResponse(Response(m='食物 %s 已经存在你的食材库中' % food.name, c='1').toJson(), content_type='application/json')
  preference = RS_Preference(food=food, market=user.market)
  preference.save()
  return HttpResponse(Response(m='成功将 %s 添加到食材库中' % food.name).toJson(), content_type='application/json')

def remove(request):
  user = User.objects.get(id=request.session['uid'])
  args = [('fid', True, long, -1)]
  args = get_post_args(request.POST, args)
  if not args[0]:
    return HttpResponse(Response(m='get args error: %s' % args[1], c='-1').toJson(), content_type='application/json')
  args = args[1]
  food = None
  try:
    food = Food.objects.get(id=args['fid'])
  except:
    return HttpResponse(Response(m='query food not exist: %s' % args['fid'], c='-2').toJson(), content_type='application/json')
  if len(RS_Preference.objects.filter(food=food).filter(market=user.market)) == 0:
    return HttpResponse(Response(m='食物 %s 不存在你的食材库中' % food.name, c='2').toJson(), content_type='application/json')
  preferences = RS_Preference.objects.filter(food=food, market=user.market)
  for p in preferences:
    p.delete()
  return HttpResponse(Response(m='成功将 %s 从食材库中移除' % food.name).toJson(), content_type='application/json')

def queryByName(request):
  user = User.objects.get(id=request.session['uid'])
  args = [('name', True, str, '', 20)]
  args = get_post_args(request.POST, args)
  if not args[0]:
    return HttpResponse(Response(m='get args error: %s' % args[1], c='-1').toJson(), content_type='application/json')
  args = args[1]
  foods = user_to_foods(user)
  foods = filter(lambda x:x.name.startswith(args['name']), foods)
  return HttpResponse(Response(m=serializers.serialize("json", foods)).toJson(), content_type="application/json")

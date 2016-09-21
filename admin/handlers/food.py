# -*- coding: utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf-8')
from django.http import HttpResponse, HttpResponseServerError, Http404
from django.shortcuts import render

import Gymer.utils
from Gymer.utils import Response, get_post_args
from Gymer.models import Food

def add(request):
  if request.method != 'POST':
    raise Http404
  args = [('id', False, long, -1), ('name', True, str, '', 20), ('calorie', True, float, 0.0), ('category', True, str, '', 20), ('GI', False, float, 0.0)]
  args = Gymer.utils.get_post_args(request.POST, args)
  if not args[0]:
    return HttpResponse(Response(m='get args error: %s' % args[1], c='-1').toJson(), content_type='application/json')
  args = args[1]
  food = None
  try:
    food = Food.objects.get(id=args['id'])
  except:
    food = Food()
  # 判断该名称的食物是否已经在数据库中
  if len(Food.objects.filter(name=args['name'])) > 0 and (not food.id or (food.id and food.id != args['id'])):
    return HttpResponse(Response(m='名称为 %s 的食物已存在数据库中' % args['name'], c=1).toJson(), content_type='application/json')
  food.name = args['name']
  food.category = args['category']
  food.calorie = args['calorie']
  food.GI = args['GI']
  food.save()
  return HttpResponse(Response(m=food.id).toJson(), content_type='application/json')

def delete(request):
  if request.method != 'POST':
    raise Http404
  args = [('id', True, long, -1)]
  args = Gymer.utils.get_post_args(request.POST, args)
  if not args[0]:
    return HttpResponse(Response(m='get args error: %s' % args[1], c='-1').toJson(), content_type='application/json')
  args = args[1]
  print args
  food = None
  try:
    food = Food.objects.get(id=args['id'])
  except:
    return HttpResponse(Response(m='query object not exist: %s' % args['id'], c='-2').toJson(), content_type='application/json')
  food.delete()
  return HttpResponse(Response(m='delete food').toJson(), content_type='application/json')

def list(request):
  return render(request, 'admin/food_list.html', {'foods' : Food.objects.all()})

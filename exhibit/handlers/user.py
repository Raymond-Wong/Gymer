# -*- coding: utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf-8')
from django.http import HttpResponse, HttpResponseServerError, Http404
from django.shortcuts import render, redirect

import Gymer.utils
from Gymer.decorators import logined
from Gymer.utils import Response, get_post_args
from Gymer.models import User, Market

def register(request):
  if request.method == 'GET':
    return render(request, 'exhibit/user_register.html')
  if request.method != 'POST':
    return HttpResponseServerError('request method error: %s' % request.method)
  args = [('account', True, str, '', 50), ('nickname', True, str, '', 20), ('password', True, str, '', 50)]
  args = get_post_args(request.POST, args)
  if not args[0]:
    return HttpResponse(Response(m='get args error: %s' % args[1], c='-1').toJson(), content_type='application/json')
  args = args[1]
  # 判断账号是否存在
  if len(User.objects.filter(account=args['account'])) > 0:
    return HttpResponse(Response(m='该邮箱已注册过账号: %s' % args['account'], c=1).toJson(), content_type="application/json")
  # 判断昵称是否存在
  if len(User.objects.filter(nickname=args['nickname'])) > 0:
    return HttpResponse(Response(m='该昵称已存在: %s' % args['nickname'], c=2).toJson(), content_type="application/json")
  newUser = User()
  newUser.account = args['account']
  newUser.nickname = args['nickname']
  newUser.password = args['password']
  newUser.save()
  # 新建一个market
  market = Market(user=newUser)
  market.save()
  return HttpResponse(Response(m='注册成功').toJson(), content_type="application/json")

def login(request):
  if request.method == 'GET':
    return render(request, 'exhibit/user_login.html')
  args = [('account', True, str, '', 50), ('password', True, str, '', 50)]
  args = get_post_args(request.POST, args)
  if not args[0]:
    return HttpResponse(Response(m='get args error: %s' % args[1], c='-1').toJson(), content_type='application/json')
  args = args[1]
  user = None
  try:
    user = User.objects.get(account=args['account'])
  except:
    return HttpResponse(Response(m='该账号不存在: %s' % args['account'], c=-2).toJson(), content_type="application/json")
  if user.password == args['password']:
    request.session['uid'] = user.id
    back_url = '/'
    if request.session.has_key('back_url'):
      back_url = request.session['back_url']
      del request.session['back_url']
    return HttpResponse(Response(m='登陆成功').toJson(), content_type="application/json")
  return HttpResponse(Response(m='密码错误', c=3).toJson(), content_type="application/json")

@logined
def logout(request):
  del request.session['uid']
  return HttpResponse(Response(m='登出成功').toJson(), content_type="application/json")

@logined
def get(request):
  user = User.objects.get(id=request.session['uid'])
  return render(request, 'exhibit/user_get.html', {'user' : user})

@logined
def set(request):
  user = User.objects.get(id=request.session['uid'])
  if request.method == 'GET':
    return render(request, 'exhibit/user_set.html', {'user' : user, 'active_page' : 'user'})
  args = [('height', True, int, 160), ('weight', True, int, 40), ('gender', True, int, 0), ('age', True, int, 18), ('exercise_level', True, int, 0)]
  args = get_post_args(request.POST, args)
  if not args[0]:
    return HttpResponse(Response(m='get args error: %s' % args[1], c='-1').toJson(), content_type='application/json')
  args = args[1]
  user.height = args['height']
  user.weight = args['weight']
  user.gender = args['gender']
  user.age = args['age']
  user.exercise_level = args['exercise_level']
  user.BMI = get_bmi(user)
  user.BMR = get_bmr(user)
  user.save()
  return HttpResponse(Response(m='修改用户信息成功').toJson(), content_type="application/json")

# 计算用户的bmi值
def get_bmi(user):
  bmi = user.weight / 2.0
  bmi = bmi / pow(user.height / 100.0, 2)
  return round(bmi, 1)

# 计算用户的bmr值
def get_bmr(user):
  factor = [1.15, 1.3, 1.4, 1.6, 1.8]
  bmr = 0
  # 女性计算公式
  if user.gender == 0:
    bmr = 661 + 9.6 * (user.weight / 2.0) + 1.72 * user.height - 4.7 * user.age
  else:
    bmr = 67 + 13.73 * (user.weight / 2.0) + 5 * user.height - 6.9 * user.age
  bmr *= factor[user.exercise_level]
  return round(bmr, 0)
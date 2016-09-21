# -*- coding: utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf-8')
from django.http import HttpResponse, HttpResponseServerError, Http404
from django.shortcuts import render, redirect

import Gymer.utils
from Gymer.utils import Response, get_post_args
from Gymer.models import User

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
  return redirect('/')

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
    back_url = request.session['back_url'] if request.session.has_key('back_url') else '/'
    del request.session['back_url']
    return redirect(back_url)
  return HttpResponse(Response(m='密码错误', c=3).toJson(), content_type="application/json")

# -*- coding: utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf-8')
import traceback


from django.http import HttpResponseServerError
from django.shortcuts import redirect

def handler(view):
  def unKnownErr(request, *args, **kwargs):
    try:
      return view(request, *args, **kwargs)
    except Exception, e:
      traceback.print_exc()
      info = sys.exc_info()
      info = str(info[1]).decode("unicode-escape")
      return HttpResponseServerError("Unknown Error Occur: %s" % info)
  return unKnownErr

def logined(view):
  def has_logined(request, *args, **kwargs):
    # 如果已经登陆了
    if request.session.has_key('uid'):
      return view(request, *args, **kwargs)
    # 如果未登陆且get请求
    if request.method == 'GET':
      request.session['back_url'] = request.get_full_path()
      return redirect('/user?action=login')
    # 如果未登陆且post请求
    request.session['back_url'] = '/'
    return HttpResponse(Response(c=-3, m='/user?action=login').toJson(), content_type="application/json")
  return has_logined


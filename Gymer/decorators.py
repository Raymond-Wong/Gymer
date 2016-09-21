# -*- coding: utf-8 -*-
from django.http import HttpResponseServerError

def handler(view):
  def unKnownErr(request, *args, **kwargs):
    try:
      return view(request, *args, **kwargs)
    except Exception, e:
      info = sys.exc_info()
      print info
      info = str(info[1]).decode("unicode-escape")
      return HttpResponseServerError("Unknown Error Occur: %s" % info)
  return unKnownErr
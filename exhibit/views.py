# -*- coding: utf-8 -*-
import handlers.user

from django.http import HttpResponseServerError

from Gymer.decorators import handler

@handler
def userHandler(request):
  action = request.GET.get('action', 'login')
  if action == 'login':
    return handlers.user.login(request)
  elif action == 'logout':
    return handlers.user.logout(request)
  elif action == 'register':
    return handlers.user.register(request)
  elif action == 'info':
    return handlers.user.info(request)
  return HttpResponseServerError('action type error: %s' % action)

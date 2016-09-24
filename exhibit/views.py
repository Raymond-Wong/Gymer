# -*- coding: utf-8 -*-
import handlers.user, handlers.food, handlers.meal

from django.http import HttpResponseServerError

from Gymer.decorators import handler, logined

@handler
def userHandler(request):
  action = request.GET.get('action', 'login')
  if action == 'login':
    return handlers.user.login(request)
  elif action == 'logout':
    return handlers.user.logout(request)
  elif action == 'register':
    return handlers.user.register(request)
  elif action == 'get':
    return handlers.user.get(request)
  elif action == 'set':
    return handlers.user.set(request)
  return HttpResponseServerError('action type error: %s' % action)

@handler
@logined
def foodHandler(request):
  action = request.GET.get('action', 'list')
  if action == 'list':
    return handlers.food.list(request)
  elif action == 'add':
    return handlers.food.add(request)
  elif action == 'remove':
    return handlers.food.remove(request)
  return HttpResponseServerError('action type error: %s' % action)

@handler
@logined
def mealHandler(request):
  action = request.GET.get('action', 'list')
  if action == 'list':
    return handlers.meal.list(request)
  elif action == 'add':
    return handlers.meal.add(request)
  elif action == 'update':
    return handlers.meal.update(request)
  elif action == 'delete':
    return handlers.meal.delete(request)
  return HttpResponseServerError('action type error: %s' % action)

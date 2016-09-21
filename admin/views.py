# -*- coding: utf-8 -*-
import handlers.food

from django.http import HttpResponseServerError

from Gymer.decorators import handler

def foodHandler(request):
  action = request.GET.get('action', 'list')
  if action == 'add':
    return handlers.food.add(request)
  elif action == 'delete':
    return handlers.food.delete(request)
  elif action == 'list':
    return handlers.food.list(request)
  return HttpResponseServerError('action type error: %s' % action)
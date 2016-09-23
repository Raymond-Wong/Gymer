# -*- coding: utf-8 -*-
import datetime
import json

from Gymer.models import Food, User, Market, RS_Preference

# 获取将food添加在自己食物库中的所有user
def food_to_users(food):
  preferences = food.rs_preference_set.all()
  markets = map(lambda x:x.market, preferences)
  users = map(lambda x:x.user, markets)
  return users

# 获取用户添加过的所有food
def user_to_foods(user, category=None):
  if not category:
    preferences = user.market.rs_preference_set.all()
  else:
    preferences = user.market.rs_preference_set.filter(food__category=category)
  foods = map(lambda x:x.food, preferences)
  return foods

def meal_to_foods(meal, category=None):
  if not category:
    amount = meal.rs_food_amount_set.all()
  else:
    amount = meal.rs_food_amount_set.filter(food__category=category)
  foods = map(lambda x:x.food, amount)
  return foods

def get_meal_calorie_GI(meal):
  calorie = 0.0
  GI = 0.0
  for fa in meal.rs_food_amount_set.all():
    calorie += (fa.amount * fa.food.calorie)
    GI += (fa.amount * fa.food.GI)
  return calorie, GI
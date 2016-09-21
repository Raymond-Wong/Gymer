# -*- coding: utf-8 -*-
from django.db import models

'''
用户类:
  priority       用户权限
  account        账号
  password       密码
  nickname       昵称
  height         身高
  weight         体重
  age            年龄
  gender         性别
  exercise_level 运动级别
  BMR            基础代谢率
  BMI            肥胖指数
'''
PRIORITY = ((0, 'admin'), (1, 'normal'))
GENDER = ((0, 'female'), (1, 'male'))
EXERCISE_LEVEL = ((0, u'长时间坐在办公室、教室里，很少或是 完全没有运动的人。'), \
  (1, u'偶尔会运动或散步、逛街、到郊外踏青，每周大约少量运动1～3次的人。'), \
  (2, u'有持续运动的习惯，或是会上健身房，每周大约运动3～6次的人。'), \
  (3, u'热爱运动，每周运动6～7次，或是工作量相当大的人。'), \
  (4, u'工作或生活作息需要大量劳动，相当消耗能量的人。'))
class User(models.Model):
  priority = models.IntegerField(choices=PRIORITY, default=1)
  account = models.CharField(max_length=50)
  password = models.CharField(max_length=50)
  nickname = models.CharField(max_length=20)
  height = models.PositiveIntegerField(default=160)
  weight = models.PositiveIntegerField(default=40)
  age = models.PositiveIntegerField(default=18)
  gender = models.PositiveIntegerField(choices=GENDER, default=0)
  exercise_level = models.PositiveIntegerField(choices=EXERCISE_LEVEL, default=0)
  BMR = models.FloatField(default=0)
  BMI = models.FloatField(default=0)

'''
食物类
  name     食物名称
  category 类别
  calorie  每100克食物的大卡数
  GI       升糖指数
'''
class Food(models.Model):
  name = models.CharField(max_length=20)
  category = models.CharField(max_length=20)
  calorie = models.FloatField(default=0)
  GI = models.FloatField(default=0)

'''
食物库类
  user 所属的用户
'''
class Market(models.Model):
  user = models.ForeignKey(User)

'''
餐类
  date    进行该餐的日期
  name    餐名称
  calorie 包含总热量
  GI      总升糖指数
  user    使用该餐的用户
'''
class Meal(models.Model):
  date = models.DateField(auto_now_add=True)
  name = models.CharField(max_length=50)
  calorie = models.FloatField(default=0)
  GI = models.FloatField(default=0)
  user = models.ForeignKey(User)

'''
食物和餐之间的数量关系
'''
class RS_Food_Amount(models.Model):
  food = models.ForeignKey(Food)
  meal = models.ForeignKey(Meal)
  amount = models.PositiveIntegerField(default=0)

'''
用户对食物的喜好程度
'''
class RS_Preference(models.Model):
  food = models.ForeignKey(Food)
  market = models.ForeignKey(Market)
  preference = models.FloatField(default=0.0)
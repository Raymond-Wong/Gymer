# -*- coding: utf-8 -*-
import datetime
import json

# 统一的httpresponse回复
class Response:
  def __init__(self, c=0, m=""):
    self.code = c
    self.msg = m
  def toJson(self):
    tmp = {}
    tmp["code"] = self.code
    tmp["msg"] = self.msg
    return json.dumps(tmp, ensure_ascii=False)

# 普通输出日志函数
def logger(msg, tp='INFO'):
  now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
  print '[%s][%s]\t%s' % (tp, now, msg)

# 从post中获取args规定的参数
def get_post_args(post, args):
  ret = {}
  for arg in args:
    key = arg[0]
    val = arg[3]
    # 如果参数必要且前段未提供，则返回错误
    if arg[1] and not post.has_key(key):
      return (False, 'post data doesn\'t have key %s' % arg[0])
    # 如果参数必要且前段提供，则用前段提供的值
    elif arg[1] and post.has_key(key):
      val = post.get(key) if post.get(key) != '' else val
    # 如果不是必须的但前段提供
    elif not arg[1] and post.has_key(key):
      val = post.get(key) if post.get(key) != '' else val
    # 判断参数类型是否正确
    if not isinstance(val, arg[2]):
      # 如果参数类型不正确则尝试进行类型转换
      try:
        val = arg[2](val)
      except:
        return (False, '%s\'s type error: require %s but got %s' % (key, arg[2], type(val)))
    # 如果是字符类型参数则判断长度
    if arg[2] == str and len(val) > arg[4]:
      return (False, '%s\'s length(%d) is bigger than max length(%d)' % (key, len(val), arg[4]))
    ret[key] = val
  return (True, ret)

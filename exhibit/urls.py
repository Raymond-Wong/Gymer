from django.conf.urls import patterns, include, url
import views

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
  url(r'^user$', views.userHandler),
  url(r'^food$', views.foodHandler),
  url(r'^meal$', views.mealHandler),
)

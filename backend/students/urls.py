from django.urls import path
from .views import student_list, login_user

urlpatterns = [
    path('students/', student_list),
    path('login/', login_user),   # ADD THIS LINE
]
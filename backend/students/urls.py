from django.urls import path
from .views import (
    login_user,
    students_api,
    faculty_api,
    courses_api,
    attendance_api,
    assignments_api,
    marks_api,
    materials_api
)

urlpatterns = [
    path('login/', login_user),

    path('students/', students_api),
    path('faculty/', faculty_api),
    path('courses/', courses_api),
    path('attendance/', attendance_api),
    path('assignments/', assignments_api),
    path('marks/', marks_api),
    path("materials/", materials_api),
]
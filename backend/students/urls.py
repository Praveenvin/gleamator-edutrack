from django.urls import path
from .views import (
    login_user,
    students_api,
    faculty_api,
    courses_api,
    attendance_api,
    assignments_api,
    marks_api,
    materials_api,
    faculty_profile,
    notifications_api,
    settings_api,
    leave_requests_api,
    change_password,
    messages_api,
    student_detail,
    student_profile,
    timetable_api,

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
    path("faculty/profile/", faculty_profile),
    path("notifications/", notifications_api),
    path("settings/", settings_api),
    path("leave-requests/", leave_requests_api),
    path("messages/", messages_api),
    path("change-password/", change_password),
    path("students/<int:id>/", student_detail),
    path("student-profile/", student_profile),
    path("timetable/",timetable_api),
]
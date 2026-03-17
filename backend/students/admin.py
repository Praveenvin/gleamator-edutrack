from django.contrib import admin
from .models import (
    Student,
    Faculty,
    Course,
    Attendance,
    Assignment,
    InternalMarks,
    StudyMaterial,
    Notification,
    Settings,
    LeaveRequest,
    Message,
    UserProfile,
    Timetable,
    StudentActivity,
    AssignmentSubmission,
)

admin.site.register(Student)
admin.site.register(Faculty)
admin.site.register(Course)
admin.site.register(Attendance)
admin.site.register(Assignment)
admin.site.register(InternalMarks)
admin.site.register(StudyMaterial)
admin.site.register(Notification)
admin.site.register(Settings)
admin.site.register(LeaveRequest)
admin.site.register(Message)
admin.site.register(UserProfile)
admin.site.register(Timetable)
admin.site.register(StudentActivity)
admin.site.register(AssignmentSubmission)


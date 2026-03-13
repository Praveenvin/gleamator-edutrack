from django.contrib import admin
from .models import Student, UserProfile
from .models import Faculty, Course, Attendance, Assignment, InternalMarks

admin.site.register(Faculty)
admin.site.register(Course)
admin.site.register(Attendance)
admin.site.register(Assignment)
admin.site.register(InternalMarks)
admin.site.register(Student)
admin.site.register(UserProfile)
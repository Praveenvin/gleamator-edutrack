from rest_framework import serializers
from .models import Student, Faculty, Course, Attendance, Assignment, InternalMarks,StudyMaterial,Notification, Settings, LeaveRequest, Message,Timetable, StudentActivity, AssignmentSubmission


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"


class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = "__all__"


class CourseSerializer(serializers.ModelSerializer):
    faculty_name = serializers.CharField(source="faculty.name", read_only=True)
    class Meta:
        model = Course
        fields = "__all__"


class AttendanceSerializer(serializers.ModelSerializer):
    course_name = serializers.StringRelatedField(source="course", read_only=True)
    class Meta:
        model = Attendance
        fields = "__all__"


class AssignmentSerializer(serializers.ModelSerializer):

    faculty_names = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = "__all__"

    def get_faculty_names(self, obj):
        return [f.name for f in obj.faculty.all()]

    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url
        return None

class AssignmentSubmissionSerializer(serializers.ModelSerializer):

    class Meta:
        model = AssignmentSubmission
        fields = "__all__"


class InternalMarksSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternalMarks
        fields = "__all__"

class StudyMaterialSerializer(serializers.ModelSerializer):

    course_name = serializers.CharField(
        source="course.course_name",
        read_only=True
    )

    class Meta:
        model = StudyMaterial
        fields = "__all__"


class NotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notification
        fields = "__all__"


class SettingsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Settings
        fields = "__all__"

class LeaveRequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = LeaveRequest
        fields = "__all__"

class MessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message
        fields = "__all__"

class TimetableSerializer(serializers.ModelSerializer):

    class Meta:
        model = Timetable
        fields = "__all__"


class StudentActivitySerializer(serializers.ModelSerializer):

    class Meta:
        model = StudentActivity
        fields = "__all__"
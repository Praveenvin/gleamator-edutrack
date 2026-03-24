from rest_framework import serializers
from .models import Student, Faculty, Course, Attendance, Assignment, InternalMarks,StudyMaterial,Notification, Settings, LeaveRequest, Message,Timetable, StudentActivity, AssignmentSubmission, Enrollment


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

    course_name = serializers.CharField(
        source="course.course_name",
        read_only=True
    )

    faculty_name = serializers.CharField(
        source="course.faculty.name",
        read_only=True
    )

    class Meta:
        model = InternalMarks
        fields = "__all__"
class StudyMaterialSerializer(serializers.ModelSerializer):

    course_name = serializers.CharField(
        source="course.course_name",
        read_only=True
    )

    faculty_name = serializers.CharField(   # ✅ ADD THIS
        source="course.faculty.name",
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

    sender_name = serializers.SerializerMethodField()
    receiver_name = serializers.SerializerMethodField()
    course_names = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = "__all__"

    # ✅ GET SENDER NAME (Student / Faculty)
    def get_sender_name(self, obj):

        user = obj.sender

        student = Student.objects.filter(user=user).first()
        if student:
            return student.name

        faculty = Faculty.objects.filter(user=user).first()
        if faculty:
            return faculty.name

        return user.username


    # ✅ GET RECEIVER NAME
    def get_receiver_name(self, obj):

        if not obj.receiver:
            return "Broadcast"

        user = obj.receiver

        student = Student.objects.filter(user=user).first()
        if student:
            return student.name

        faculty = Faculty.objects.filter(user=user).first()
        if faculty:
            return faculty.name

        return user.username


    # ✅ COURSE NAMES
    def get_course_names(self, obj):
        return [c.course_name for c in obj.courses.all()]
        
class TimetableSerializer(serializers.ModelSerializer):

    class Meta:
        model = Timetable
        fields = "__all__"


class StudentActivitySerializer(serializers.ModelSerializer):

    class Meta:
        model = StudentActivity
        fields = "__all__"



class EnrollmentSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(source='student.name', read_only=True)
    department = serializers.CharField(source='student.department', read_only=True)
    year = serializers.IntegerField(source='student.year', read_only=True)

    course_name = serializers.CharField(source='course.course_name', read_only=True)   # ✅ ADD
    faculty_name = serializers.CharField(source='course.faculty.name', read_only=True) # ✅ ADD

    class Meta:
        model = Enrollment
        fields = '__all__'
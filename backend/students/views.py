from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import UserProfile, Student, Faculty, Course, Attendance, Assignment, InternalMarks,StudyMaterial, Notification, Settings, LeaveRequest, Message,Timetable, StudentActivity
from .serializers import StudentSerializer, FacultySerializer, CourseSerializer, AttendanceSerializer, AssignmentSerializer, InternalMarksSerializer, StudyMaterialSerializer, NotificationSerializer, SettingsSerializer, LeaveRequestSerializer, MessageSerializer, TimetableSerializer, StudentActivitySerializer
import json


@csrf_exempt
def login_user(request):

    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Invalid request method"
        }, status=405)

    try:
        data = json.loads(request.body)

        username = data.get("username")
        password = data.get("password")

        user = authenticate(username=username, password=password)

        if not user:
            return JsonResponse({
                "success": False,
                "message": "Invalid username or password"
            }, status=401)

        profile = UserProfile.objects.get(user=user)

        return JsonResponse({
    "success": True,
    "id": user.id,
    "username": user.username,
    "role": profile.role,
    "message": "Login successful"
})

    except Exception:
        return JsonResponse({
            "success": False,
            "message": "Server error"
        }, status=500)


@api_view(['GET','POST'])
def students_api(request):

    if request.method == 'GET':
        students = Student.objects.all()
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = StudentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)


@api_view(['GET','POST'])
def faculty_api(request):

    if request.method == 'GET':
        faculty = Faculty.objects.all()
        serializer = FacultySerializer(faculty, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = FacultySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)


@api_view(['GET','POST'])
def courses_api(request):

    if request.method == 'GET':
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = CourseSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)


@api_view(['GET','POST'])
def attendance_api(request):

    if request.method == 'GET':

        student_id = request.query_params.get("student")

        if student_id:
            attendance = Attendance.objects.filter(student_id=student_id)
        else:
            attendance = Attendance.objects.all()

        serializer = AttendanceSerializer(attendance, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = AttendanceSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)
@api_view(['GET','POST'])
def assignments_api(request):

    if request.method == 'GET':
        assignments = Assignment.objects.all()
        serializer = AssignmentSerializer(assignments, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = AssignmentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)


@api_view(['GET','POST'])
def marks_api(request):

    if request.method == 'GET':
        marks = InternalMarks.objects.all()
        serializer = InternalMarksSerializer(marks, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = InternalMarksSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)


@api_view(["GET","POST"])
def materials_api(request):

    if request.method == "GET":

        materials = StudyMaterial.objects.all()
        serializer = StudyMaterialSerializer(materials, many=True)
        return Response(serializer.data)

    if request.method == "POST":

        serializer = StudyMaterialSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

@api_view(["GET"])
def faculty_profile(request):

    faculty = Faculty.objects.first()

    if not faculty:
        return Response({"error": "No faculty found"}, status=404)

    data = {
        "id": faculty.id,
        "name": faculty.name,
        "email": faculty.email,
        "department": faculty.department,
        "designation": faculty.designation,
    }

    return Response(data)


@api_view(["GET"])
def notifications_api(request):

    notifications = Notification.objects.all().order_by("-created_at")[:10]
    serializer = NotificationSerializer(notifications, many=True)

    return Response(serializer.data)


@api_view(["GET","PUT"])
def settings_api(request):

    settings = Settings.objects.first()

    if request.method == "GET":

        serializer = SettingsSerializer(settings)
        return Response(serializer.data)

    if request.method == "PUT":

        serializer = SettingsSerializer(settings, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

@api_view(["GET","POST"])
def leave_requests_api(request):

    if request.method == "GET":

        leaves = LeaveRequest.objects.all().order_by("-created_at")
        serializer = LeaveRequestSerializer(leaves,many=True)
        return Response(serializer.data)

    if request.method == "POST":

        serializer = LeaveRequestSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors,status=400)

@api_view(["GET","POST"])
def messages_api(request):

    if request.method == "GET":

        messages = Message.objects.all().order_by("-created_at")

        serializer = MessageSerializer(messages,many=True)

        return Response(serializer.data)

    if request.method == "POST":

        serializer = MessageSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save()

            return Response(serializer.data)

        return Response(serializer.errors,status=400)

@api_view(["POST"])
def change_password(request):

    user = request.user

    current = request.data.get("current")
    new = request.data.get("new")

    if not user.check_password(current):
        return Response({"error":"Wrong password"},status=400)

    user.set_password(new)
    user.save()

    return Response({"message":"Password updated"})

@api_view(["GET","PUT"])
def student_detail(request, id):

    try:
        student = Student.objects.get(id=id)
    except Student.DoesNotExist:
        return Response({"error":"Student not found"}, status=404)

    if request.method == "GET":
        serializer = StudentSerializer(student)
        return Response(serializer.data)

    if request.method == "PUT":
        serializer = StudentSerializer(student, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

@api_view(["GET"])
def student_profile(request):

    username = request.GET.get("username")

    try:
        student = Student.objects.filter(name=username).first()

        if not student:
            student = Student.objects.filter(email=username).first()

        if not student:
            return Response({"error": "Student not found"}, status=404)

        serializer = StudentSerializer(student)
        return Response(serializer.data)

    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["GET","POST"])
def timetable_api(request):

    if request.method == "GET":

        student = request.query_params.get("student")

        timetable = Timetable.objects.filter(student_id=student)

        serializer = TimetableSerializer(timetable,many=True)

        return Response(serializer.data)

    if request.method == "POST":

        serializer = TimetableSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors,status=400)

@api_view(["GET","POST"])
def student_activity_api(request):

    if request.method == "GET":

        student = request.query_params.get("student")

        activities = StudentActivity.objects.filter(student_id=student)

        serializer = StudentActivitySerializer(activities,many=True)

        return Response(serializer.data)

    if request.method == "POST":

        serializer = StudentActivitySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors,status=400)

@api_view(["PUT","DELETE"])
def student_activity_detail(request,id):

    activity = StudentActivity.objects.get(id=id)

    if request.method == "PUT":

        serializer = StudentActivitySerializer(activity,data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

    if request.method == "DELETE":

        activity.delete()

        return Response({"message":"Deleted"})
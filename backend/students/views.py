from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import UserProfile, Student, Faculty, Course, Attendance, Assignment, InternalMarks
from .serializers import StudentSerializer, FacultySerializer, CourseSerializer, AttendanceSerializer, AssignmentSerializer, InternalMarksSerializer
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
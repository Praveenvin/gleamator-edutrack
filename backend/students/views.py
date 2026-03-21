from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import IntegrityError
from .models import UserProfile, Student, Faculty, Course, Attendance, Assignment, InternalMarks,StudyMaterial, Notification, Settings, LeaveRequest, Message,Timetable, StudentActivity,AssignmentSubmission, Enrollment
from .serializers import StudentSerializer, FacultySerializer, CourseSerializer, AttendanceSerializer, AssignmentSerializer, InternalMarksSerializer, StudyMaterialSerializer, NotificationSerializer, SettingsSerializer, LeaveRequestSerializer, MessageSerializer, TimetableSerializer, StudentActivitySerializer, AssignmentSubmissionSerializer, EnrollmentSerializer
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

        faculty_id = None

        # ✅ ADD THIS BLOCK
        if profile.role == "faculty":
            faculty = Faculty.objects.filter(email=user.username).first()
            if faculty:
                faculty_id = faculty.id

        return JsonResponse({
            "success": True,
            "id": user.id,
            "username": user.username,
            "role": profile.role,
            "faculty_id": faculty_id,   # ✅ NEW FIELD
            "message": "Login successful"
        })

    except Exception as e:
        return JsonResponse({
            "success": False,
            "message": str(e)
        }, status=500)

@api_view(['GET','POST'])
def students_api(request):

    if request.method == 'GET':

        course_id = request.GET.get("course")

        if course_id and str(course_id).isdigit():
            students = Student.objects.filter(
    enrollments__course_id=int(course_id)
).distinct()
        else:
            students = Student.objects.all()   # ✅ fallback (important)

        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)
@api_view(['GET','POST'])
def faculty_api(request):

    if request.method == 'GET':
        faculty = Faculty.objects.all()
        serializer = FacultySerializer(faculty, many=True)
        return Response(serializer.data)

    if request.method == 'POST':

        serializer = FacultySerializer(data=request.data)

        if serializer.is_valid():

            try:
                serializer.save()
                return Response(serializer.data)

            except IntegrityError:
                return Response(
                    {"error": "Faculty with same Email already exists"},
                    status=400
                )

        return Response(serializer.errors, status=400)


@api_view(["GET","PUT","DELETE"])
def faculty_detail(request, id):

    try:
        faculty = Faculty.objects.get(id=id)
    except Faculty.DoesNotExist:
        return Response({"error":"Faculty not found"}, status=404)

    if request.method == "GET":
        serializer = FacultySerializer(faculty)
        return Response(serializer.data)

    if request.method == "PUT":
        serializer = FacultySerializer(faculty, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    if request.method == "DELETE":
        faculty.delete()
        return Response({"message":"Faculty deleted successfully"})


from django.contrib.auth.models import User

@api_view(["GET"])
def current_faculty(request):

    username = request.GET.get("username")

    try:
        user = User.objects.get(username=username)

        faculty = Faculty.objects.filter(email=user.email).first()

        if not faculty:
            return Response({"error": "Faculty not linked"}, status=404)

        return Response({
            "id": faculty.id,
            "name": faculty.name,
            "email": faculty.email,
            "department": faculty.department,
            "designation": faculty.designation,
        })

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

        
@api_view(['GET','POST'])
def courses_api(request):

    if request.method == 'GET':

        faculty_id = request.GET.get("faculty")

        if faculty_id and str(faculty_id).isdigit():
            courses = Course.objects.filter(faculty_id=int(faculty_id))
        else:
            courses = Course.objects.all()

        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)


    if request.method == 'POST':

        data = request.data.copy()

        # normalize course code
        if "course_code" in data:
            data["course_code"] = data["course_code"].strip().upper()

        # convert numeric fields
        try:
            data["faculty"] = int(data.get("faculty"))
            data["semester"] = int(data.get("semester"))
        except:
            return Response(
                {"error": "Faculty and semester must be numbers"},
                status=400
            )

        serializer = CourseSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)



@api_view(["PUT","DELETE"])
def course_detail(request, id):

    try:
        course = Course.objects.get(id=id)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)


    if request.method == "PUT":

        data = request.data.copy()

        # normalize course code
        course_code = data.get("course_code", "").strip().upper()
        data["course_code"] = course_code

        # check duplicate except current record
        if Course.objects.filter(course_code=course_code).exclude(id=id).exists():
            return Response(
                {"error": "Course code already exists"},
                status=400
            )

        serializer = CourseSerializer(course, data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)


    if request.method == "DELETE":
        course.delete()
        return Response({"message": "Course deleted successfully"})

@api_view(['GET','POST'])
def attendance_api(request):

    # ================= GET =================
    if request.method == 'GET':

        student_id = request.query_params.get("student")
        course_id = request.query_params.get("course")
        date = request.query_params.get("date")

        attendance = Attendance.objects.all()

        # ✅ OPTIONAL FILTERS (no breaking change)
        if student_id:
            attendance = attendance.filter(student_id=student_id)

        if course_id:
            attendance = attendance.filter(course_id=course_id)

        if date:
            attendance = attendance.filter(date=date)

        serializer = AttendanceSerializer(attendance, many=True)
        return Response(serializer.data)


    # ================= POST (UPSERT) =================
    if request.method == 'POST':

        student = request.data.get("student")
        course = request.data.get("course")
        date = request.data.get("date")
        status_val = request.data.get("status")

        # ✅ BASIC VALIDATION (safe)
        if not student or not course or not date or not status_val:
            return Response(
                {"error": "student, course, date, status required"},
                status=400
            )

        try:
            # 🔥 CHECK EXISTING RECORD
            existing = Attendance.objects.filter(
                student_id=student,
                course_id=course,
                date=date
            ).first()

            if existing:
                # ✅ UPDATE (OVERWRITE)
                existing.status = status_val
                existing.save()

                return Response({
                    "message": "Attendance updated successfully",
                    "id": existing.id,
                    "status": existing.status
                })

            else:
                # ✅ CREATE NEW
                serializer = AttendanceSerializer(data=request.data)

                if serializer.is_valid():
                    serializer.save()

                    return Response({
                        "message": "Attendance created successfully",
                        "data": serializer.data
                    })

                return Response(serializer.errors, status=400)

        except Exception as e:
            return Response({"error": str(e)}, status=400)

@api_view(["GET", "POST"])
def assignments_api(request):

    # ---------- GET ----------
    if request.method == "GET":

        faculty_id = request.GET.get("faculty")
        student_id = request.GET.get("student")

        assignments = Assignment.objects.all().order_by("-created_at")

        # ---------- STUDENT MODE ----------
        if student_id:
            data = []

            for a in assignments:

                submission = AssignmentSubmission.objects.filter(
                    student_id=student_id,
                    assignment_id=a.id
                ).first()

                status = submission.status if submission else "Pending"

                data.append({
                    "id": a.id,
                    "title": a.title,
                    "due_date": a.due_date,
                    "status": status,
                    "file_url": a.file.url if a.file else None
                })

            return Response(data)

        # ---------- ADMIN / FACULTY VIEW ----------
        data = []

        for a in assignments:

            status = "Pending"

            # ✅ SAFE faculty check
            if faculty_id and str(faculty_id).isdigit():

                submission = AssignmentSubmission.objects.filter(
                    assignment_id=a.id,
                    faculty_id=int(faculty_id),
                    submitted_by="faculty"
                ).first()

                if submission:
                    status = submission.status

            data.append({
                "id": a.id,
                "title": a.title,
                "description": a.description,
                "due_date": a.due_date,
                "created_by": a.created_by,
                "status": status,
                "faculty": [f.id for f in a.faculty.all()],
                "faculty_names": [f.name for f in a.faculty.all()],
                "course": a.course.id if a.course else None,
                "file_url": a.file.url if a.file else None
            })

        return Response(data)

    # ---------- POST ----------
    if request.method == "POST":

        try:
            title = request.data.get("title")
            description = request.data.get("description")
            due_date = request.data.get("due_date")

            faculty_ids = request.data.getlist("faculty")
            file = request.FILES.get("file")

            created_by = request.data.get("created_by", "admin")
            course_id = request.data.get("course")

            assignment = Assignment.objects.create(
                title=title,
                description=description,
                due_date=due_date,
                file=file,
                created_by=created_by,
                course_id=course_id if course_id else None
            )

            if faculty_ids:
                assignment.faculty.set(faculty_ids)

            return Response({"message": "Assignment created successfully"})

        except Exception as e:
            return Response({"error": str(e)}, status=400)
@api_view(["PUT", "DELETE"])
def assignment_detail(request, id):

    try:
        assignment = Assignment.objects.get(id=id)
    except Assignment.DoesNotExist:
        return Response({"error": "Assignment not found"}, status=404)


    # ---------- PUT ----------
    if request.method == "PUT":

        try:
            assignment.title = request.data.get("title")
            assignment.description = request.data.get("description")
            assignment.due_date = request.data.get("due_date")

            if "file" in request.FILES:
                assignment.file = request.FILES["file"]

            assignment.save()

            faculty_ids = request.data.getlist("faculty")
            assignment.faculty.set(faculty_ids)

            return Response({"message": "Assignment updated successfully"})

        except Exception as e:
            return Response({"error": str(e)}, status=400)


    # ---------- DELETE ----------
    if request.method == "DELETE":

        assignment.delete()
        return Response({"message": "Assignment deleted successfully"})
@api_view(["POST"])
def submit_assignment(request):

    assignment_id = request.data.get("assignment")
    faculty_id = request.data.get("faculty")
    file = request.FILES.get("file")

    if not assignment_id:
        return Response({"error": "assignment required"}, status=400)

    existing = AssignmentSubmission.objects.filter(
        faculty_id=faculty_id,
        assignment_id=assignment_id
    ).first()

    if existing:
        existing.file = file
        existing.status = "Submitted"
        existing.save()
        return Response({"message": "Submission updated"})

    AssignmentSubmission.objects.create(
        faculty_id=faculty_id,   # ✅ FIXED
        assignment_id=assignment_id,
        file=file,
        status="Submitted",
        submitted_by="faculty"
    )

    return Response({"message": "Submitted successfully"})



@api_view(['GET', 'POST'])
def marks_api(request):

    # ================= GET =================
    if request.method == 'GET':

        course_id = request.GET.get("course")
        student_id = request.GET.get("student")

        if student_id and str(student_id).isdigit():
            marks = InternalMarks.objects.filter(student_id=int(student_id))

        elif course_id and str(course_id).isdigit():
            marks = InternalMarks.objects.filter(course_id=int(course_id))

        else:
            marks = InternalMarks.objects.all()

        serializer = InternalMarksSerializer(marks, many=True)
        return Response(serializer.data)

    # ================= POST (UPSERT) =================
    if request.method == 'POST':

        student = request.data.get("student")
        course = request.data.get("course")
        exam_type = request.data.get("exam_type")
        marks_value = request.data.get("marks")

        # ✅ VALIDATION
        if not student or not course or not exam_type:
            return Response(
                {"error": "student, course, exam_type required"},
                status=400
            )

        try:
            obj, created = InternalMarks.objects.update_or_create(
                student_id=student,
                course_id=course,
                exam_type=exam_type,
                defaults={"marks": marks_value}
            )

            return Response({
                "message": "Created" if created else "Updated",
                "id": obj.id
            })

        except Exception as e:
            return Response({"error": str(e)}, status=400)

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


@api_view(["PUT","DELETE"])
def material_detail(request, id):

    try:
        material = StudyMaterial.objects.get(id=id)
    except StudyMaterial.DoesNotExist:
        return Response({"error":"Material not found"}, status=404)

    if request.method == "PUT":

        serializer = StudyMaterialSerializer(
            material,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    if request.method == "DELETE":

        material.delete()

        return Response({
            "message":"Material deleted successfully"
        })

        
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

@api_view(["GET", "POST"])
def messages_api(request):

    # ================= GET =================
    if request.method == "GET":

        messages = Message.objects.all().order_by("-created_at")
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

    # ================= POST =================
    if request.method == "POST":

        try:
            sender_id = request.data.get("sender")
            receiver_username = request.data.get("receiver")
            course_ids = request.data.get("courses", [])
            broadcast = str(request.data.get("broadcast", "false")).lower() == "true"
            subject = request.data.get("subject")
            body = request.data.get("message")   # ⚠️ IMPORTANT

            # ---------- VALIDATION ----------
            if not sender_id or not subject or not body:
                return Response(
                    {"error": "sender, subject, message required"},
                    status=400
                )

            sender = User.objects.get(id=sender_id)

            # ================= SINGLE STUDENT =================
            if receiver_username:

                receiver = User.objects.filter(username=receiver_username).first()

                if not receiver:
                    return Response({"error": "Receiver not found"}, status=404)

                # student message
                Message.objects.create(
                    sender=sender,
                    receiver=receiver,
                    subject=subject,
                    body=body
                )

                # self copy (IMPORTANT)
                Message.objects.create(
                    sender=sender,
                    receiver=sender,
                    subject=subject,
                    body=body
                )

                return Response({
                    "message": "Message sent to student"
                })

            # ================= COURSE BASED =================
            elif course_ids:

                enrollments = Enrollment.objects.filter(course_id__in=course_ids)

                sent_users = set()
                count = 0

                # ✅ SELF COPY (IMPORTANT)
                faculty_msg = Message.objects.create(
                    sender=sender,
                    receiver=sender,
                    subject=subject,
                    body=body
                )
                faculty_msg.courses.add(*course_ids)

                for e in enrollments:

                    student = e.student
                    user = User.objects.filter(username=student.email).first()

                    if user and user.id not in sent_users:

                        msg = Message.objects.create(
                            sender=sender,
                            receiver=user,
                            subject=subject,
                            body=body
                        )

                        msg.courses.add(*course_ids)

                        sent_users.add(user.id)
                        count += 1

                return Response({
                    "message": f"Sent to {count} students"
                })

            # ================= BROADCAST =================
            elif broadcast:

                students = Student.objects.all()
                count = 0

                # ✅ SELF COPY
                Message.objects.create(
                    sender=sender,
                    receiver=sender,
                    subject=subject,
                    body=body,
                    is_broadcast=True
                )

                for s in students:

                    user = User.objects.filter(username=s.email).first()

                    if user:
                        Message.objects.create(
                            sender=sender,
                            receiver=user,
                            subject=subject,
                            body=body,
                            is_broadcast=True
                        )

                        count += 1

                return Response({
                    "message": f"Broadcast sent to {count} students"
                })

            return Response(
                {"error": "No receiver / course / broadcast specified"},
                status=400
            )

        except Exception as e:
            return Response({"error": str(e)}, status=500)

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

@api_view(["GET","PUT","DELETE"])
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

    if request.method == "DELETE":
        student.delete()
        return Response({"message": "Student deleted successfully"})

        
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



@api_view(["GET","POST"])
def enrollment_api(request):

    # ---------- GET ----------
    if request.method == "GET":

        course_id = request.GET.get("course")
        student_id = request.GET.get("student")

        enrollments = Enrollment.objects.all()

        if course_id:
            enrollments = enrollments.filter(course_id=course_id)

        if student_id:
            enrollments = enrollments.filter(student_id=student_id)

        serializer = EnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data)

    # ---------- POST ----------
    if request.method == "POST":

        serializer = EnrollmentSerializer(data=request.data)

        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data)
            except:
                return Response({"error":"Already enrolled"}, status=400)

        return Response(serializer.errors, status=400)

        
@api_view(["DELETE"])
def enrollment_detail(request, id):

    try:
        enrollment = Enrollment.objects.get(id=id)
    except Enrollment.DoesNotExist:
        return Response({"error":"Not found"}, status=404)

    enrollment.delete()
    return Response({"message":"Removed successfully"})
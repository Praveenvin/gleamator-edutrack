from django.db import models
from django.contrib.auth.models import User


class Student(models.Model):
    name = models.CharField(max_length=100)
    usn = models.CharField(max_length=20, unique=True)
    department = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    year = models.IntegerField()

    def __str__(self):
        return self.name


class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('faculty', 'Faculty'),
        ('student', 'Student'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.user.username} - {self.role}"

class Faculty(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    department = models.CharField(max_length=100)
    designation = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Course(models.Model):
    course_name = models.CharField(max_length=100)
    course_code = models.CharField(max_length=20, unique=True)
    department = models.CharField(max_length=50)
    faculty = models.ForeignKey(Faculty, on_delete=models.SET_NULL, null=True)
    semester = models.IntegerField()

    def __str__(self):
        return self.course_name

class Attendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=10, choices=[
        ("Present", "Present"),
        ("Absent", "Absent")
    ])

    def __str__(self):
        return f"{self.student} - {self.course} - {self.date}"
    class Meta:
        unique_together = ['student', 'course', 'date']
class Assignment(models.Model):

    title = models.CharField(max_length=200)
    description = models.TextField()
    due_date = models.DateField()

    file = models.FileField(upload_to="assignments/", null=True, blank=True)

    # ✅ SAFE ADD
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    faculty = models.ManyToManyField(Faculty, blank=True)

    created_by = models.CharField(
        max_length=20,
        choices=[
            ("admin", "Admin"),
            ("faculty", "Faculty")
        ],
        default="admin"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    faculty = models.ManyToManyField(Faculty, blank=True)

    created_by = models.CharField(
        max_length=20,
        choices=[
            ("admin", "Admin"),
            ("faculty", "Faculty")
        ],
        default="admin"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
class AssignmentSubmission(models.Model):

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    faculty = models.ForeignKey(   # ✅ ADD THIS
        Faculty,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    # ✅ NEW (for faculty submissions)
    submitted_by = models.CharField(
        max_length=20,
        choices=[
            ("student", "Student"),
            ("faculty", "Faculty")
        ],
        default="student"
    )

    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)

    file = models.FileField(upload_to="submissions/", null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=[
            ("Submitted","Submitted"),
            ("Pending","Pending"),
            ("Late","Late")
        ],
        default="Submitted"
    )

    # ✅ NEW (important for evaluation)
    marks = models.IntegerField(null=True, blank=True)
    feedback = models.TextField(blank=True)

    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.assignment.title} - {self.submitted_by}"


class InternalMarks(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    marks = models.IntegerField()
    exam_type = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.student} - {self.course} - {self.marks}"

class StudyMaterial(models.Model):

    title = models.CharField(max_length=200)

    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    file = models.FileField(upload_to="materials/")

    uploaded_at = models.DateTimeField(auto_now_add=True)

    downloads = models.IntegerField(default=0)

    def __str__(self):
        return self.title

class Notification(models.Model):
    message = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message


class Settings(models.Model):

    institution_name = models.CharField(max_length=200)
    address = models.TextField()
    contact_email = models.EmailField()
    phone = models.CharField(max_length=20)

    academic_year = models.CharField(max_length=20)
    semester = models.CharField(max_length=20)

    email_notifications = models.BooleanField(default=True)
    sms_alerts = models.BooleanField(default=True)
    weekly_reports = models.BooleanField(default=True)

    def __str__(self):
        return self.institution_name


class LeaveRequest(models.Model):

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="leave_requests"
    )

    faculty = models.ForeignKey(
        Faculty,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    from_date = models.DateField()
    to_date = models.DateField()

    reason = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=[
            ("Pending","Pending"),
            ("Approved","Approved"),
            ("Rejected","Rejected")
        ],
        default="Pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.name} - {self.status}"

class Message(models.Model):

    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="sent_messages"
    )

    receiver = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="received_messages"
    )

    subject = models.CharField(max_length=200)
    body = models.TextField()

    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} -> {self.receiver}"

class Timetable(models.Model):

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="timetable"
    )

    day = models.CharField(max_length=20)

    time = models.CharField(max_length=20)

    subject = models.CharField(max_length=100)

    location = models.CharField(max_length=100, blank=True)

    note = models.TextField(blank=True)

    color = models.CharField(
        max_length=20,
        default="#2563EB"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.name} - {self.day} {self.time}"

class StudentActivity(models.Model):

    student = models.ForeignKey(Student,on_delete=models.CASCADE)

    day = models.CharField(max_length=20)

    time = models.CharField(max_length=10)

    activity = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)

class Enrollment(models.Model):

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="enrollments"
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="enrollments"
    )

    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['student', 'course']

    def __str__(self):
        return f"{self.student.name} → {self.course.course_name}"
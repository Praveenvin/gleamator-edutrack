from django.db import models
from django.contrib.auth.models import User


class Student(models.Model):
    name = models.CharField(max_length=100)
    usn = models.CharField(max_length=20, unique=True)
    department = models.CharField(max_length=50)
    email = models.EmailField()
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
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE)
    semester = models.IntegerField()
    department = models.CharField(max_length=100)

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

class Assignment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    due_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

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
import random
from students.models import Student, Faculty, Course, Assignment, StudyMaterial

# CLEAR OLD DATA
Student.objects.all().delete()
Faculty.objects.all().delete()
Course.objects.all().delete()
Assignment.objects.all().delete()
StudyMaterial.objects.all().delete()
print("Seeding database...")

# -----------------------
# CREATE FACULTY
# -----------------------

departments = ["CSE", "ECE", "IT", "ME"]

faculties = []

for i in range(1, 11):
    f = Faculty.objects.create(
        name=f"Faculty {i}",
        email=f"faculty{i}@college.com",
        department=random.choice(departments),
        designation=random.choice([
            "Professor",
            "Associate Professor",
            "Assistant Professor"
        ])
    )
    faculties.append(f)

print("Faculty created")

# -----------------------
# CREATE COURSES
# -----------------------

courses = []

for i in range(1, 11):
    c = Course.objects.create(
        course_name=f"Course {i}",
        course_code=f"CS{i:03}",
        faculty=random.choice(faculties),
        semester=random.randint(1,8),
        department=random.choice(departments)
    )
    courses.append(c)

print("Courses created")

# -----------------------
# CREATE STUDENTS
# -----------------------

for i in range(1, 51):
    Student.objects.create(
        name=f"Student {i}",
        usn=f"1RV21CS{str(i).zfill(3)}",
        department=random.choice(departments),
        email=f"student{i}@gmail.com",
        phone=f"98{random.randint(10000000,99999999)}",
        year=random.randint(1,4)
    )

print("Students created")

# -----------------------
# CREATE ASSIGNMENTS
# -----------------------

for i in range(1, 11):
    Assignment.objects.create(
        course=random.choice(courses),
        title=f"Assignment {i}",
        description="Sample assignment description",
        due_date="2026-04-01"
    )

print("Assignments created")

# -----------------------
# CREATE MATERIALS
# -----------------------

titles = [
"Data Structures Notes",
"Operating Systems Slides",
"Machine Learning Intro",
"Algorithms Guide",
"Database Notes",
]

for i in range(10):
    StudyMaterial.objects.create(
        title=random.choice(titles),
        course=random.choice(courses),
        file=f"materials/sample{i}.pdf",
        downloads=random.randint(5,100)
    )

print("Materials created")

print("Database seeding completed!")
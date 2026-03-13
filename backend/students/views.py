from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from .models import UserProfile
from .models import Student
import json

def student_list(request):
    students = list(Student.objects.values())
    return JsonResponse(students, safe=False)
@csrf_exempt
def login_user(request):

    if request.method == "POST":
        data = json.loads(request.body)

        username = data.get("username")
        password = data.get("password")

        user = authenticate(username=username, password=password)

        if user:
            profile = UserProfile.objects.get(user=user)

            return JsonResponse({
                "username": user.username,
                "role": profile.role,
                "message": "Login successful"
            })

        return JsonResponse({"error": "Invalid credentials"}, status=400)

    return JsonResponse({"message": "Use POST request"})
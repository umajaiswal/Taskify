from django.shortcuts import render , redirect
from django.contrib.auth import authenticate , login , logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

def home(request):
    return render(request,'home.html')


@login_required(login_url='login')
def dashboard(request):
    return render(request,'dashboard.html')


def user_login(request):
    if request.method == 'POST':
        user_name = request.POST.get('user_name')
        user_password = request.POST.get('user_password')

        user = authenticate(request, username=user_name, password=user_password)
        
        if user is not None :
            login(request, user)
            return redirect('dashboard')
        else :
            return render(request,'login.html',{'error':'invalid authentication'})
    return render(request,  'login.html')
        



def user_logout(request):
    logout(request) 
    return redirect('home')

def register(request):
    if request.method=='POST':
        user_name = request.POST.get('user_name')
        email = request.POST.get('email')
        user_password = request.POST.get('user_password')

        if User.objects.filter(username=user_name ,email=email).exists():
            return render(request,'registration.html',{'error':'already exist user or email'})
        
        user = User.objects.create_user(
            username=user_name ,email=email,password=user_password)
        return redirect ('login')
    return render (request,'register.html')

from django.shortcuts import render , redirect
from django.contrib.auth import authenticate , login

def home(request):
    return render(request,'home.html')

def dashboard(request):
    return render(request,'dashboard.html')


def user_login(request):
    if request.method == 'post':
        user_name = request.post.get('user_name')
        user_password = request.post.get('user_password')

        user = authenticate(request, user_name=user_name, user_password=user_password)
        
        if user is not None :
            login(request, user)
            return redirect('dashboard')
        else :
            return render(request,'login.html',{'error':'invelid authentication'})
    return render(request,  'login.html')
        
        
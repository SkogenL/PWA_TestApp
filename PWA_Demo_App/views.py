from django.shortcuts import render
from django.http import Http404, HttpResponse, HttpResponseBadRequest
from . import models

def index(request):
    return render(request, "index.html")

# Create your views here.

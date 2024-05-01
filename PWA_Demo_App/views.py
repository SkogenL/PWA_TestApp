from django.shortcuts import render
from django.http import Http404, HttpResponse, HttpResponseBadRequest
from . import models
from django.conf import settings

def index(request):
    return render(request, "index.html")

def service_worker(request):
    sw_path = settings.BASE_DIR / "serviceworker.js"
    response = HttpResponse(open(sw_path).read(), content_type='application/javascript')
    return response
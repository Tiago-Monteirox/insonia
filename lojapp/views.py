# lojapp/views.py

from django.shortcuts import render
from .models import Produto


def product_list(request):
    produtos = Produto.objects.all()
    return render(request, 'lojapp/product_list.html', {'produtos': produtos})

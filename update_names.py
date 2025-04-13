import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "insonia.settings")
django.setup()

from django.utils.text import capfirst
from lojapp.models import Produto

def update_names():
    produtos = Produto.objects.all()

    for produto in produtos:
        produto.name = capfirst(produto.name)
        produto.save()

if __name__ == "__main__":
    update_names()
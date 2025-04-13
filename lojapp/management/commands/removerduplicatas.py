from django.core.management.base import BaseCommand
from lojapp.models import Produto

class Command(BaseCommand):
    help = 'Remove duplicatas de produtos'

    def handle(self, *args, **kwargs):
        self.remover_duplicatas()
        self.stdout.write(self.style.SUCCESS('Duplicatas removidas com sucesso'))

    def remover_duplicatas(self):
        produtos_vistos = set()
        duplicatas = []

        for produto in Produto.objects.all():
            # Aqui estamos usando 'name' como critério de duplicação
            if produto.name in produtos_vistos:
                duplicatas.append(produto)
            else:
                produtos_vistos.add(produto.name)

        # Removendo as duplicatas
        for duplicata in duplicatas:
            duplicata.delete()
from django.db import models
from category.models import Category


class Produto(models.Model):
    name = models.CharField(max_length=100)
    quantidade = models.PositiveIntegerField(blank=True, null=True)
    descricao_curta = models.TextField(max_length=100,blank=True, null=True)
    imagem = models.ImageField(
        upload_to='produto_imagens/%Y/%m/', blank=True, null=True)
    slug = models.SlugField(unique=True, blank=True, null=True)
    preco_custo = models.FloatField(verbose_name='Preço')

    def __str__(self):
        return self.name
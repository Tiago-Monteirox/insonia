from django.db import models
from django.urls import reverse
from django.utils.text import slugify
import os
from django.conf import settings

class Categoria(models.Model):
    name = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(unique=True, blank=True, null=True)

    class Meta:
        ordering = ('name',)
        verbose_name = 'categoria'
        verbose_name_plural = 'categorias'

    def __str__(self):
        return self.name
    
    def get_absolute_url(self):
        return reverse('', args=[self.slug])

  
    def save(self, *args, **kwargs):
        if not self.slug:
            slug = f'{slugify(self.name)}'
            self.slug = slug

        super().save(*args, **kwargs)    
    
    def get_absolute_url(self):
        return reverse('', args=[self.slug])
    

class Produto(models.Model):
    name = models.CharField(max_length=100)
    quantidade = models.PositiveIntegerField(blank=True, null=True)
    preco_venda = models.FloatField(verbose_name='Valor', blank=True, null=True)
    descricao_curta = models.TextField(max_length=100,blank=True, null=True)
    imagem = models.ImageField(
        upload_to='produto_imagens/%Y/%m/', blank=True, null=True)
    slug = models.SlugField(unique=True, blank=True, null=True)
    preco_custo = models.FloatField(verbose_name='Preço')

    def __str__(self):
        return self.name
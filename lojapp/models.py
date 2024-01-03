from django.db import models
from django.urls import reverse
from django.utils.text import slugify
import os
from django.conf import settings
from django.core.exceptions import ValidationError

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
    categoria = models.ForeignKey(Categoria, on_delete = models.CASCADE, null=True)
    quantidade = models.PositiveIntegerField(blank=True, null=True)
    preco_venda = models.FloatField(verbose_name='Preço', blank=True, null=True)
    preco_venda_promocional = models.FloatField(verbose_name='Preço promocional', blank=True, null=True)
    descricao_curta = models.TextField(max_length=100, blank=True, null=True)
    # imagem = models.ImageField(upload_to='produto_imagens/%Y/%m/', blank=True, null=True)
    slug = models.SlugField(unique=True, blank=True, null=True)
    preco_custo = models.FloatField(verbose_name='Preço de custo', blank=False, null=False)

    def __str__(self):
        return self.name


    def clean(self):
        # Validação dos preços para assegurar que não são negativos
        if self.preco_venda is not None and self.preco_venda < 0:
            raise ValidationError('O preço de venda não pode ser negativo.')
        if self.preco_venda_promocional is not None and self.preco_venda_promocional < 0:
            raise ValidationError('O preço promocional não pode ser negativo.')
        if self.preco_custo is not None and self.preco_custo < 0:
            raise ValidationError('O preço de custo não pode ser negativo.')

        # Validação para assegurar que o preço promocional não é maior que o preço normal
        if self.preco_venda_promocional is not None and self.preco_venda is not None:
            if self.preco_venda_promocional > self.preco_venda:
                raise ValidationError('O preço promocional não pode ser maior que o preço de venda.')

    def save(self, *args, **kwargs):
        self.full_clean()  # Chama o método clean para validação
        super(Produto, self).save(*args, **kwargs)

class ProdutoImagem(models.Model):
    produto = models.ForeignKey(Produto, related_name='imagens', on_delete=models.CASCADE)
    imagem = models.ImageField(upload_to='produto_imagens/%Y/%m/')

    def __str__(self):
        return f"Imagem de {self.produto.name}"





































# class Produto(models.Model):
#     name = models.CharField(max_length=100)
#     quantidade = models.PositiveIntegerField(blank=True, null=True)
#     preco_venda = models.FloatField(verbose_name='Valor', blank=True, null=True)
#     descricao_curta = models.TextField(max_length=100,blank=True, null=True)
#     imagem = models.ImageField(
#         upload_to='produto_imagens/%Y/%m/', blank=True, null=True)
#     slug = models.SlugField(unique=True, blank=True, null=True)
#     preco_custo = models.FloatField(verbose_name='Preço')

#     def __str__(self):
#         return self.name
from django.db import models
from django.urls import reverse
from django.utils.text import slugify
import os
from django.conf import settings
from django.core.exceptions import ValidationError
from djmoney.models.fields import MoneyField

class Categoria(models.Model):
    name = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(unique=True, blank=True, null=True)

    class Meta:
        ordering = ('name',)
        verbose_name = 'Categoria'
        verbose_name_plural = 'Categorias'

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
    
class Marca(models.Model):
    name = models.CharField(max_length=100, db_index=True)
    slug = models.SlugField(unique=True, blank=True, null=True)

    class Meta:
        ordering = ('name',)
        verbose_name = 'Marca'
        verbose_name_plural = 'Marcas'

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
    marca = models.ForeignKey(Marca, on_delete=models.CASCADE, null=True, blank=True)
    quantidade = models.PositiveIntegerField(blank=True, null=True)
    preco_venda = MoneyField(max_digits=14, decimal_places=2, default_currency='BRL', verbose_name='Preço', blank=True, null=True)
    preco_venda_promocional = MoneyField(max_digits=14, decimal_places=2, default_currency='BRL', verbose_name='Preço promocional', blank=True, null=True)
    descricao_curta = models.TextField(max_length=100, blank=True, null=True)
    # imagem = models.ImageField(upload_to='produto_imagens/%Y/%m/', blank=True, null=True)
    slug = models.SlugField(unique=True, blank=True, null=True)
    preco_custo = MoneyField(max_digits=14, decimal_places=2, default_currency='BRL', verbose_name='Preço de custo', blank=False, null=False)
    tem_variacao = models.BooleanField(default=False)

    def __str__(self):
        return self.name


    def clean(self):
        # Validação dos preços para assegurar que não são negativos
        if self.preco_venda is not None and self.preco_venda < 0:
            raise ValidationError('O preço de venda não pode ser negativo.')
        if self.preco_venda_promocional is not None and self.preco_venda_promocional < 0:
            raise ValidationError('O preço promocional não pode ser negativo.')
        if self.preco_custo is not None and self.preco_custo.amount < 0:
            raise ValidationError('O preço de custo não pode ser negativo.')

        # Validação para assegurar que o preço promocional não é maior que o preço normalDeslizando no colo do pai - mc menor da vg - triz

    def save(self, *args, **kwargs):
        self.full_clean()  # Chama o método clean para validação
        super(Produto, self).save(*args, **kwargs)

class ProdutoImagem(models.Model):
    produto = models.ForeignKey(Produto, related_name='imagens', on_delete=models.CASCADE)
    imagem = models.ImageField(upload_to='produto_imagens/%Y/%m/')

    def __str__(self):
        return f"Imagem de {self.produto.name}"

class NomeVariacao(models.Model):
    name = models.CharField(max_length=50, unique=True)  # Exemplo: Tamanho, Cor

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Nome da Variação'
        verbose_name_plural = 'Nomes das Variações'

class ValorVariacao(models.Model):
    nome_variacao = models.ForeignKey(NomeVariacao, related_name='valores', on_delete=models.CASCADE, null=True)
    valor = models.CharField(max_length=50, )  # Exemplo: 'M', 'Vermelho'

    def __str__(self):
        return f'{self.nome_variacao.name}: {self.valor}'

    class Meta:
        verbose_name = 'Valor da Variação'
        verbose_name_plural = 'Valores das Variações'
        unique_together = ('nome_variacao', 'valor')

class Variacao(models.Model):
    produto = models.ForeignKey(Produto, related_name='variacoes', on_delete=models.CASCADE)
    valor = models.ForeignKey(ValorVariacao, on_delete=models.CASCADE)  # Exemplo: M, Vermelho
    quantidade = models.PositiveIntegerField(default=0)


    def __str__(self):
        return f"{self.valor.nome_variacao.name} - {self.valor.valor} (Quantidade: {self.quantidade})"

    class Meta:
        unique_together = ('produto', 'valor')  # Garante que cada variação seja única por produto
        verbose_name = 'Variação'
        verbose_name_plural = 'Variações'

            # Valida se a soma das quantidades das variações não excede a quantidade total do produto
    def clean(self):
        total_variacoes = sum([var.quantidade for var in Variacao.objects.filter(produto=self.produto) if var != self])
        if total_variacoes + self.quantidade > self.produto.quantidade:
            raise ValidationError('A soma das quantidades das variações não pode exceder a quantidade total do produto.')

    def save(self, *args, **kwargs):
        self.full_clean()  # Validação antes de salvar
        super(Variacao, self).save(*args, **kwargs)





























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
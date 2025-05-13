import os
from django.db import models
from django.urls import reverse
from django.utils.text import slugify
from django.core.exceptions import ValidationError
from djmoney.models.fields import MoneyField
from djmoney.money import Money
from decimal import Decimal, InvalidOperation

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
    name = models.CharField(max_length=100, unique=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, null=True)
    marca = models.ForeignKey(Marca, on_delete=models.CASCADE, null=True, blank=True)
    quantidade = models.PositiveIntegerField(blank=True, null=True)
    preco_venda = MoneyField(
        max_digits=14, 
        decimal_places=2, 
        default_currency='BRL',
        verbose_name='Preço de venda',
        blank=True, 
        null=True
    )
    preco_venda_promocional = MoneyField(
        max_digits=14, 
        decimal_places=2, 
        default_currency='BRL',
        verbose_name='Preço promocional',
        blank=True, 
        null=True
    )
    descricao_curta = models.TextField(max_length=100, blank=True, null=True)
    slug = models.SlugField(unique=True, blank=True, null=True)
    preco_custo = MoneyField(
        max_digits=14, 
        decimal_places=2, 
        default_currency='BRL',
        verbose_name='Preço de custo',
        blank=False, 
        null=False
    )
    
    def __str__(self):
        return self.name

    def clean_precos(self):
        def normalizar(valor):
            if isinstance(valor, str):
                valor = valor.replace('R$', '').replace(',', '.').strip()
            try:
                return Decimal(valor)
            except (InvalidOperation, TypeError, AttributeError):
                return Decimal('0.00')

        if self.preco_venda is not None:
            self.preco_venda = Money(
                normalizar(self.preco_venda.amount if hasattr(self.preco_venda, 'amount') else normalizar(self.preco_venda)), 
                'BRL'
            )
        
        if self.preco_venda_promocional is not None:
            self.preco_venda_promocional = Money(
                normalizar(self.preco_venda_promocional.amount if hasattr(self.preco_venda_promocional, 'amount') else normalizar(self.preco_venda_promocional)), 
                'BRL'
            )
        
        self.preco_custo = Money(
            normalizar(self.preco_custo.amount if hasattr(self.preco_custo, 'amount') else normalizar(self.preco_custo)), 
            'BRL'
        )

    def clean(self):
        # Validação básica dos preços
        if self.preco_venda and self.preco_venda.amount < Decimal('0.00'):
            raise ValidationError('O preço de venda não pode ser negativo.')
        
        if self.preco_venda_promocional and self.preco_venda_promocional.amount < Decimal('0.00'):
            raise ValidationError('O preço promocional não pode ser negativo.')
        
        if self.preco_custo.amount < Decimal('0.00'):
            raise ValidationError('O preço de custo não pode ser negativo.')
        
        # Validação de preço promocional menor que preço normal
        if self.preco_venda and self.preco_venda_promocional:
            if self.preco_venda_promocional.amount >= self.preco_venda.amount:
                raise ValidationError('O preço promocional deve ser menor que o preço normal.')

    def save(self, *args, **kwargs):
        self.clean_precos()
        self.full_clean()
        super().save(*args, **kwargs)
        
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


    def __str__(self):
        return f"{self.valor.nome_variacao.name}"

    class Meta:
        unique_together = ('produto', 'valor')  # Garante que cada variação seja única por produto
        verbose_name = 'Variação'
        verbose_name_plural = 'Variações'


    def save(self, *args, **kwargs):
        self.full_clean()  # Validação antes de salvar
        super(Variacao, self).save(*args, **kwargs)













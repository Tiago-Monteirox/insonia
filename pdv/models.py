from decimal import Decimal
from django.db import models
from django.conf import settings
from djmoney.models.fields import MoneyField
from djmoney.money import Money
from django.core.exceptions import ValidationError
from django.utils import timezone
from lojapp.models import Produto 



class Venda(models.Model):
    """
    Modelo para representar uma venda.
    """
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        verbose_name="Usuário"
    )
    data_venda = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Data da Venda"
    )
    valor_total = MoneyField(
        max_digits=14,
        decimal_places=2,
        default_currency='BRL',
        null=True,  # Permitir nulo para inicialização
        blank=True,
        verbose_name="Valor Total"
    )
    lucro_total = MoneyField(
        max_digits=14,
        decimal_places=2,
        default_currency='BRL',
        null=True,  # Permitir nulo para inicialização
        blank=True,
        verbose_name="Lucro Total"
    )

    class Meta:
        verbose_name = "Venda"
        verbose_name_plural = "Vendas"
        ordering = ['-data_venda']

    def __str__(self):
        return f"Venda #{self.id} - {self.data_venda.strftime('%d/%m/%Y')}"

    def clean(self):
        """Validações antes de salvar"""
        if self.valor_total and self.valor_total.amount < 0:
            raise ValidationError("O valor total não pode ser negativo")
        if self.lucro_total and self.lucro_total.amount < 0:
            raise ValidationError("O lucro não pode ser negativo")

    def save(self, *args, **kwargs):
        """
        Sobrescreve o método save para calcular os totais antes de salvar.
        """
        super().save(*args, **kwargs)  # Salva primeiro para ter o ID
        self.calcular_totais() # Garante que os totais são calculados e salvos
        # Não precisa salvar novamente aqui, pois o calcular_totais já faz isso.

    def calcular_totais(self):
        """Calcula totais automaticamente"""
        self.valor_total = sum(
            (item.subtotal for item in self.itens.all()),
            Money(0, 'BRL')
        )
        self.lucro_total = sum(
            (item.lucro for item in self.itens.all()),
            Money(0, 'BRL')
        )
        self.save(update_fields=['valor_total', 'lucro_total'])  # Salva os totais calculados

    @classmethod
    def calcular_valor_total_vendas(cls):
        """Calcula o valor total de todas as vendas."""
        return sum(venda.valor_total for venda in cls.objects.all())

    @classmethod
    def calcular_valor_total_por_periodo(cls, data_inicio, data_fim):
        """Calcula o valor total das vendas em um período."""
        resultado = cls.objects.filter(
            data_venda__range=[data_inicio, data_fim]
        ).aggregate(total=models.Sum('valor_total'))
        return resultado['total'] or Money(0, 'BRL')

    @classmethod
    def calcular_lucro_total_vendas(cls):
        """Calcula o lucro total de todas as vendas."""
        resultado = cls.objects.aggregate(total=models.Sum('lucro_total'))
        return resultado['total'] or Money(0, 'BRL')

    @classmethod
    def calcular_lucro_total_por_periodo(cls, data_inicio, data_fim):
        """Calcula o lucro total das vendas em um período."""
        resultado = cls.objects.filter(
            data_venda__range=[data_inicio, data_fim]
        ).aggregate(total=models.Sum('lucro_total'))
        return resultado['total'] or Money(0, 'BRL')



class ItemVenda(models.Model):
    venda = models.ForeignKey(
        'Venda', 
        on_delete=models.CASCADE, 
        related_name='itens',
        verbose_name="Venda"
    )
    produto = models.ForeignKey(
        Produto,
        on_delete=models.PROTECT,
        verbose_name="Produto"
    )
    quantidade = models.PositiveIntegerField(
        default=1,
        verbose_name="Quantidade"
    )
    preco_venda = MoneyField(
        max_digits=14,
        decimal_places=2,
        default_currency='BRL',
        default=Decimal('0.00'),
        verbose_name="Preço de Venda"
    )
    preco_custo = MoneyField(
        max_digits=14,
        decimal_places=2,
        default_currency='BRL',
        default=Decimal('0.00'),
        verbose_name="Preço de Custo"
    )

    class Meta:
        verbose_name = "Item de Venda"
        verbose_name_plural = "Itens de Venda"
        ordering = ['-id']

    def __str__(self):
        return f"{self.quantidade}x {self.produto.name}"

    @property
    def subtotal(self):
        """Calcula o valor total do item"""
        return self.preco_venda * self.quantidade

    @property
    def lucro(self):
        """Calcula o lucro do item"""
        return (self.preco_venda - self.preco_custo) * self.quantidade

    def clean(self):
        """Validações antes de salvar"""
        if self.quantidade <= 0:
            raise ValidationError("A quantidade deve ser maior que zero")
        
        if self.preco_venda.amount <= 0:
            raise ValidationError("O preço de venda deve ser positivo")
        
        if self.preco_custo.amount <= 0:
            raise ValidationError("O preço de custo deve ser positivo")
        
        if self.preco_venda < self.preco_custo:
            raise ValidationError("O preço de venda não pode ser menor que o preço de custo")

        # Verifica estoque
        if self.produto.quantidade < self.quantidade:
            raise ValidationError(
                f"Estoque insuficiente. Disponível: {self.produto.quantidade}"
            )

    def save(self, *args, **kwargs):
        """Sobrescreve o save para atualizar estoque e totais"""
        self.full_clean()
        
        # Se for um novo item ou a quantidade foi alterada
        if not self.pk or self.quantidade != ItemVenda.objects.get(pk=self.pk).quantidade:
            self.atualizar_estoque()
        
        super().save(*args, **kwargs)
        self.venda.calcular_totais()

    def atualizar_estoque(self):
        """Atualiza o estoque do produto"""
        if self.pk:  # Se for uma atualização
            old_item = ItemVenda.objects.get(pk=self.pk)
            self.produto.quantidade += old_item.quantidade
        
        self.produto.quantidade -= self.quantidade
        self.produto.save()

    def delete(self, *args, **kwargs):
        """Sobrescreve o delete para atualizar estoque"""
        self.produto.quantidade += self.quantidade
        self.produto.save()
        super().delete(*args, **kwargs)
        self.venda.calcular_totais()
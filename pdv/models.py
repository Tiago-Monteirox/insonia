from django.db import models
from django.conf import settings
from decimal import Decimal
from djmoney.models.fields import MoneyField
from djmoney.money import Money

class Venda(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    data_venda = models.DateTimeField(auto_now_add=True)

    @classmethod 
    def calcular_valor_total_vendas(cls):
        return sum(venda.total_venda for venda in cls.objects.all())
    
    @classmethod
    def calcular_valor_total_por_periodo(cls, data_inicio, data_fim):
        vendas_no_periodo = cls.objects.filter(data_venda__range=[data_inicio, data_fim])
        return sum(venda.total_venda for venda in vendas_no_periodo)
    
    @classmethod
    def calcular_lucro_total_vendas(cls):
        return sum(venda.lucro_total for venda in cls.objects.all())
    
    @classmethod
    def calcular_lucro_total_por_periodo(cls, data_inicio, data_fim):
        vendas_no_periodo = cls.objects.filter(data_venda__range=[data_inicio, data_fim])
        return sum(venda.lucro_total for venda in vendas_no_periodo)

    @property
    def total_venda(self):
        return sum(item.calcular_valor_total_venda() for item in self.itens_venda.all())
    
    @property
    def lucro_total(self):
        total_venda = self.total_venda.amount if isinstance(self.total_venda, Money) else self.total_venda
        preco_custo_total = self.preco_custo_total()
        preco_custo_total = preco_custo_total.amount if isinstance(preco_custo_total, Money) else preco_custo_total
        return total_venda - preco_custo_total



    def preco_custo_total(self):
        return sum(item.calcular_valor_total_custo() for item in self.itens_venda.all())

    def calcular_valores(self):
        # Atualiza o campo valor_venda da instância de Venda
        self.valor_venda = self.total_venda

        # Calcula o lucro
        self.lucro = self.lucro_total

        # Salva a instância de Venda após calcular os valores
        super().save()

class ItemVenda(models.Model):
    venda = models.ForeignKey(Venda, on_delete=models.CASCADE, related_name='itens_venda')
    produto = models.ForeignKey('lojapp.Produto', on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField()
    valor_venda = MoneyField(max_digits=10, decimal_places=2, default=0)

    def calcular_valor_total_venda(self):
        if isinstance(self.valor_venda, Money):
            total = self.valor_venda * self.quantidade
            return Money(amount=total.amount, currency=self.valor_venda.currency)
        else:
            raise ValueError("valor_venda deve ser uma instância de Money")
        
    def calcular_valor_total_custo(self):
        return self.produto.preco_custo * self.quantidade

    def save(self, *args, **kwargs):
        # Certifique-se de que o valor_venda é não nulo e não negativo
        if self.valor_venda is None or self.valor_venda < Money(0, self.valor_venda.currency):
            raise ValueError("O valor de venda deve ser especificado e não pode ser negativo.")

        # Calcula o valor de venda antes de salvar
        self.valor_venda = self.calcular_valor_total_venda()

        # Atualiza a quantidade disponível do produto
        self.atualizar_quantidade_produto()

        super().save(*args, **kwargs)

    def atualizar_quantidade_produto(self):
        # Reduz a quantidade disponível do produto
        nova_quantidade = self.produto.quantidade - self.quantidade
        if nova_quantidade < 0:
            raise ValueError("Quantidade insuficiente do produto disponível.")
        self.produto.quantidade = nova_quantidade
        self.produto.save()

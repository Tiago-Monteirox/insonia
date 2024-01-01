from django.db import models
from django.conf import settings
from decimal import Decimal

class Venda(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    data_venda = models.DateTimeField(auto_now_add=True)

    @property
    def total_venda(self):
        return sum(item.calcular_valor_total_venda() for item in self.itens_venda.all())
    
    @property
    def lucro_total(self):
        return Decimal(str(self.total_venda)) - Decimal(str(self.preco_custo_total()))

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
    valor_venda = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def calcular_valor_total_venda(self):
        return self.valor_venda * self.quantidade

    def calcular_valor_total_custo(self):
        return self.produto.preco_custo * self.quantidade

    def save(self, *args, **kwargs):
        # Certifique-se de que o valor_venda é não nulo e não negativo
        if self.valor_venda is None or self.valor_venda < 0:
            raise ValueError("O valor de venda deve ser especificado e não pode ser negativo.")

        # Calcula o valor de venda antes de salvar
        self.valor_venda = self.calcular_valor_total_venda()
        super().save(*args, **kwargs)

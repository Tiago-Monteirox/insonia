import graphene
from graphene_django import DjangoObjectType
from .models import Venda, ItemVenda
from moneyed import Money

class MoneyObjectType(graphene.ObjectType):
    amount = graphene.Float(required=True)
    currency = graphene.String(required=True)

class ItemVendaType(DjangoObjectType):
    subtotal = graphene.Field(MoneyObjectType)
    lucro = graphene.Field(MoneyObjectType)

    class Meta:
        model = ItemVenda
        fields = "__all__"

    def resolve_subtotal(self, info):
        return {
            'amount': float(self.subtotal.amount),
            'currency': str(self.subtotal.currency)
        }

    def resolve_lucro(self, info):
        return {
            'amount': float(self.lucro.amount),
            'currency': str(self.lucro.currency)
        }
    
class VendaType(DjangoObjectType):
    valorTotal = graphene.Field(MoneyObjectType)
    lucroTotal = graphene.Field(MoneyObjectType)
    itens = graphene.List(ItemVendaType)

    class Meta:
        model = Venda
        fields = "__all__"

    def resolve_valorTotal(self, info):
        if self.valor_total:
            return {
                'amount': float(self.valor_total.amount),
                'currency': str(self.valor_total.currency)
            }

    def resolve_lucroTotal(self, info):
        if self.lucro_total:
            return {
                'amount': float(self.lucro_total.amount),
                'currency': str(self.lucro_total.currency)
            }
    
    def resolve_itens(self, info):
        return self.itens.all()
    
class Query(graphene.ObjectType):
    total_vendas = graphene.List(VendaType)
    vendas_por_id = graphene.Field(VendaType, id=graphene.Int(required=True))

    def resolve_total_vendas(self, info):
        return Venda.objects.all()
    
    def resolve_vendas_por_id(self, info, id):
        try:
            return Venda.objects.get(pk=id)
        except Venda.DoesNotExist:
            return None
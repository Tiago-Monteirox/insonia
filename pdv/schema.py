import graphene
from graphene import InputObjectType, ID, Int
from graphene_django import DjangoObjectType
from .models import Venda, ItemVenda
from lojapp.models import Produto
from moneyed import Money
from django.contrib.auth.models import User
from django.db import transaction

#Utilitário para verificar estoque

def verificar_estoque(produto, quantidade):
    if produto.quantidade < quantidade:
        raise Exception(f"Estoque insuficiente para o produto {produto.name}.")

class MoneyObjectType(graphene.ObjectType):
    amount = graphene.Float(required=True)
    currency = graphene.String(required=True)

class ItemVendaType(DjangoObjectType):
    subtotal = graphene.Field(MoneyObjectType)
    lucro = graphene.Field(MoneyObjectType)

    class Meta:
        model = ItemVenda
        fields = ('id', 'venda', 'produto', 'quantidade', 'preco_venda', 'preco_custo')

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
    

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class VendaType(DjangoObjectType):
    valorTotal = graphene.Field(MoneyObjectType)
    lucroTotal = graphene.Field(MoneyObjectType)
    itens = graphene.List(ItemVendaType)
    usuario = graphene.Field(UserType)
    dataVenda = graphene.DateTime()


    class Meta:
        model = Venda
        fields = ('id', 'usuario', 'data', 'valor_total', 'lucro_total', 'itens')

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
    
    def resolve_dataVenda(self, info):
        return self.data_venda
    
class CriarVendaInput(graphene.InputObjectType):
    usuarioId = ID(required=True)
    itens = graphene.List(graphene.NonNull(lambda: ItemVendaInput), required=True)

class ItemVendaInput(graphene.InputObjectType):
    produtoId = ID(required=True)
    quantidade = Int(required=True)

class CriarVenda(graphene.Mutation):
    class Arguments:
        input = CriarVendaInput(required=True)
        
    venda = graphene.Field(VendaType)    

    def mutate(self, info, input):
        usuario = User.objects.get(pk=input.usuarioId)

        venda = Venda.objects.create(
            usuario=usuario,
            valor_total=Money(0, 'BRL'),
            lucro_total=Money(0, 'BRL')     
        )

        for item_input in input.itens:
            produto = Produto.objects.get(pk=item_input.produtoId)
            verificar_estoque(produto, item_input.quantidade)


            ItemVenda.objects.create(
                venda=venda,
                produto=produto,
                quantidade=item_input.quantidade,
                preco_venda=produto.preco_venda,
                preco_custo=produto.preco_custo
            )

            venda.calcular_totais()  # Atualiza os valores totais da venda
        return CriarVenda(venda=venda)
    


class CriarItemVenda(graphene.Mutation):
    item_venda = graphene.Field(ItemVendaType)

    class Arguments:
        venda_id = graphene.ID(required=True)
        produto_id = graphene.ID(required=True)
        quantidade = graphene.Int(required=True)

    def mutate(self, info, venda_id, produto_id, quantidade):
        venda = Venda.objects.get(pk=venda_id)
        produto = Produto.objects.get(pk=produto_id)

        verificar_estoque(produto, quantidade)

        item = ItemVenda.objects.create(
            venda = venda,
            produto = produto,
            quantidade = quantidade,
            preco_venda = produto.preco_venda,
            preco_custo = produto.preco_custo
        )

        venda.calcular_totais()

        return CriarItemVenda(item_venda=item)


class RemoverItemVenda(graphene.Mutation):
    sucesso = graphene.Boolean(required=True)
    mensagem = graphene.String()
    item_id = graphene.ID()

    class Arguments:
        item_id = graphene.ID(required=True)

    def mutate(self, info, item_id):
        try:
            item = ItemVenda.objects.get(pk=item_id)
            venda = item.venda
            item.delete()
            venda.calcular_totais()
            return RemoverItemVenda(
                sucesso=True,
                item_id=item_id
            )
        except ItemVenda.DoesNotExist:
            return RemoverItemVenda(
                sucesso=False,
                mensagem="Item não encontrado",
                item_id=item_id
            )


class RemoverVenda(graphene.Mutation):
    class Arguments:
        venda_id = graphene.ID(required=True, description="ID da venda a ser removida")
    
    sucesso = graphene.Boolean(required=True)
    mensagem = graphene.String()
    venda_id = graphene.ID(description="ID da venda removida")

    def mutate(self, info, venda_id):
        try:
            venda = Venda.objects.get(pk=venda_id)
            venda.itens.all().delete()  # Remove todos os itens da venda
            venda.delete()

            return RemoverVenda(
                sucesso = True,
                mensagem = f"Venda {venda_id} removida com sucesso.",
                venda_id = venda_id
            )
        except Venda.DoesNotExist:
            return RemoverVenda(
                sucesso = False,
                mensagem = "Venda não encontrada.",
                venda_id = venda_id
            )   
            


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
    
class Mutation(graphene.ObjectType):
    criar_venda = CriarVenda.Field()
    criar_item_venda = CriarItemVenda.Field()
    remover_item_venda = RemoverItemVenda.Field()
    remover_venda = RemoverVenda.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
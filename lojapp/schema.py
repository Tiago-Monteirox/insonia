import graphene
from graphene_django import DjangoObjectType
from .models import Produto, Categoria, Marca, ProdutoImagem, Variacao, ValorVariacao, NomeVariacao
from graphene.types import Scalar
from graphql.language import ast
from moneyed import Money

class MoneyType(Scalar):
    @staticmethod
    def serialize(value):
        if isinstance(value, Money):
            return {
                'amount':float(value.amount),
                'currency': str(value.currency)
            }
        return value

    @staticmethod
    def parse_literal(node):
        if isinstance(node, ast.ObjectValue):
            return Money(
                amount=node.fields[0].value,
                currency=node.fields[1].value
            )
        
    @staticmethod
    def parse_value(value):
        return Money(
            amount=value['amount'],
            currency=value['currency']
        )        
    
class MoneyObjectType(graphene.ObjectType):
    amount = graphene.Float(required=True)
    currency = graphene.String(required=True)


class ValorVariacaoType(DjangoObjectType):
    class Meta:
        model = ValorVariacao
        fields = "__all__"


class NomeVariacaoType(DjangoObjectType):
    class Meta:
        model = NomeVariacao
        fields = "__all__"


class VariacaoType(DjangoObjectType):
    class Meta:
        model = Variacao
        fields = "__all__"


class ProdutoImagemType(DjangoObjectType):
    class Meta:
        model = ProdutoImagem
        fields = "__all__"


class CategoriaType(DjangoObjectType):
    class Meta:
        model = Categoria
        fields = "__all__"


class MarcaType(DjangoObjectType):
    class Meta:
        model = Marca
        fields = "__all__"


class ProdutoType(DjangoObjectType):
    class Meta:
        model = Produto
        fields = "__all__"
    
    precoVenda = graphene.Field(MoneyObjectType)
    precoVendaPromocional = graphene.Field(MoneyObjectType)
    precoCusto = graphene.Field(MoneyObjectType)

    imagens = graphene.List(ProdutoImagemType)
    variacoes = graphene.List(VariacaoType)
    

    def resolve_precoVenda(self, info):
        if self.preco_venda:
            return {
                'amount': float(self.preco_venda.amount),
                'currency': str(self.preco_venda.currency)
            } 
        return None
    
    def resolve_precoCusto(self, info):
        return {
            'amount': float(self.preco_custo.amount),
            'currency': str(self.preco_custo.currency)
        }
    
    def resolve_precoVendaPromocional(self, info):
        if self.preco_venda_promocional:
            return {
                'amount': float(self.preco_venda_promocional.amount),
                'currency': str(self.preco_venda_promocional.currency)
            }
        return None
        
    def resolve_imagens(self, info):
        return self.imagens.all()
    
    def resolve_variacoes(self, info):
        return self.variacoes.all()


class Query(graphene.ObjectType):
    todos_produtos = graphene.List(ProdutoType)
    produto = graphene.Field(ProdutoType, id=graphene.Int(required=True))
    todas_categorias = graphene.List(CategoriaType)
    todas_marcas = graphene.List(MarcaType)

    def resolve_todos_produtos(self, info, **kwargs):
        return Produto.objects.all()
    
    def resolve_produto(self, info, id):
        try:
            return Produto.objects.get(pk=id)
        except Produto.DoesNotExist:
            return None
        
    def resolve_todas_categorias(self, info, **kwargs):
        return Categoria.objects.all()

    def resolve_todas_marcas(self, info, **kwargs):
        return Marca.objects.all()

schema = graphene.Schema(query=Query)
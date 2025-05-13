from decimal import Decimal
from rest_framework import serializers
from djmoney.contrib.django_rest_framework import MoneyField
from .models import (
    Categoria, Marca, Produto,
    ProdutoImagem, NomeVariacao,
    ValorVariacao, Variacao
)

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'name', 'slug']

class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = ['id', 'name', 'slug']

class NomeVariacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = NomeVariacao
        fields = ['id', 'name']

class ValorVariacaoSerializer(serializers.ModelSerializer):
    nome_variacao = NomeVariacaoSerializer()

    class Meta:
        model = ValorVariacao
        fields = ['id', 'nome_variacao', 'valor']

class VariacaoSerializer(serializers.ModelSerializer):
    valor = ValorVariacaoSerializer()

    class Meta:
        model = Variacao
        fields = ['id', 'valor']

class ProdutoImagemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProdutoImagem
        fields = ['id', 'imagem']

class ProdutoSerializer(serializers.ModelSerializer):
    preco_venda = MoneyField(max_digits=10, decimal_places=2)
    preco_venda_promocional = MoneyField(max_digits=10, decimal_places=2)
    preco_custo = MoneyField(max_digits=10, decimal_places=2)
    categoria = CategoriaSerializer()
    marca = MarcaSerializer()
    variacoes = VariacaoSerializer(many=True)
    imagens = ProdutoImagemSerializer(many=True)    

    class Meta:
        model = Produto
        fields = [
            'id', 'name', 'categoria', 'marca', 'quantidade',
            'preco_venda', 'preco_venda_promocional', 'descricao_curta', 
            'slug', 'preco_custo', 'variacoes', 'imagens'
        ]

    def validate(self, data):
        if 'preco_venda' in data and data['preco_venda'].amount < 0:
            raise serializers.ValidationError("Preço de venda não pode ser negativo")
        if 'preco_venda_promocional' in data and data['preco_venda_promocional'].amount < 0:
            raise serializers.ValidationError("Preço promocional não pode ser negativo")
        if 'preco_custo' in data and data['preco_custo'].amount < 0:
            raise serializers.ValidationError("Preço de custo não pode ser negativo")
        return data

class ProdutoCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = [
            'name', 'categoria', 'marca', 'quantidade',
            'preco_venda', 'preco_venda_promocional', 'descricao_curta',
            'preco_custo'
        ]
    
from decimal import Decimal
from rest_framework import serializers
from djmoney.contrib.django_rest_framework import MoneyField

class ProdutoCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = [
            'name', 'categoria', 'marca', 'quantidade',
            'preco_venda', 'preco_venda_promocional', 'descricao_curta',
            'preco_custo'
        ]
    
    def validate(self, data):
        # Converter valores Money para Decimal antes de comparar
        def get_decimal_value(value):
            if hasattr(value, 'amount'):  # Se for objeto Money
                return Decimal(str(value.amount))
            return Decimal(str(value))
        
        # Validação de valores negativos
        money_fields = ['preco_venda', 'preco_venda_promocional', 'preco_custo']
        
        for field in money_fields:
            if field in data:
                value = get_decimal_value(data[field])
                if value < Decimal('0'):
                    raise serializers.ValidationError(
                        {field: "O valor não pode ser negativo"}
                    )
                data[field] = value  # Armazena como Decimal
        
        # Validação de preço promocional
        if 'preco_venda' in data and 'preco_venda_promocional' in data:
            preco_venda = get_decimal_value(data['preco_venda'])
            preco_promocional = get_decimal_value(data['preco_venda_promocional'])
            
            if preco_promocional >= preco_venda:
                raise serializers.ValidationError({
                    'preco_venda_promocional': 'Deve ser menor que o preço normal'
                })
        
        return data
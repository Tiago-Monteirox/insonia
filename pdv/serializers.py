from rest_framework import serializers
from pdv.models import Venda, ItemVenda
from .models import Produto  # Importe Produto diretamente do seu módulo
# from lojapp.serializers import ProdutoSerializer # Remova esta importação circular
from djmoney.money import Money
from decimal import Decimal



class ProdutoSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Produto.
    """
    class Meta:
        model = Produto
        fields = ['id', 'name']  # Inclua outros campos se necessário


class ItemVendaSerializer(serializers.ModelSerializer):
    """ 
    Serializer para o modelo ItemVenda.
    """
    produto = ProdutoSerializer(read_only=True)
    produto_id = serializers.PrimaryKeyRelatedField(
        queryset=Produto.objects.all(),
        source='produto',
        write_only=True,
        required=True # Adicionei required=True
    )
    quantidade = serializers.IntegerField(min_value=Decimal('0'))
    preco_venda = serializers.DecimalField(
        max_digits=10, decimal_places=2, min_value=Decimal('0')
    )  # Validação

    class Meta:
        model = ItemVenda
        fields = [
            'id', 'produto', 'produto_id', 'quantidade',
            'preco_venda',  # Corrigido nome do campo
            'subtotal', 'lucro'
        ]
        read_only_fields = ['subtotal', 'lucro']

    def create(self, validated_data):
        produto = validated_data['produto']
        quantidade = validated_data['quantidade']
        preco_venda = validated_data['preco_venda']
        preco_custo = produto.preco_custo 

        # Garante que há estoque suficiente ANTES de criar o ItemVenda
        if produto.quantidade < quantidade:
            raise serializers.ValidationError(
                f"Estoque insuficiente para {produto.name}. Disponível: {produto.quantidade}"
            )

        item_venda = ItemVenda.objects.create(
            produto=produto,
            quantidade=quantidade,
            preco_venda=preco_venda,
            preco_custo=preco_custo
        )
        return item_venda



class VendaSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Venda.
    """
    itens = ItemVendaSerializer(many=True) # Mudado para itens
    usuario = serializers.StringRelatedField()
    valor_total = serializers.DecimalField(
        max_digits=14, decimal_places=2, read_only=True
    )  # Adicionado valor_total
    lucro_total = serializers.DecimalField(
        max_digits=14, decimal_places=2, read_only=True
    )

    class Meta:
        model = Venda
        fields = [
            'id', 'usuario', 'data_venda', 'itens',
            'valor_total', 'lucro_total'
        ]
        read_only_fields = ['usuario', 'data_venda', 'valor_total', 'lucro_total']

    def create(self, validated_data):
        itens_data = validated_data.pop('itens') # Mudado para itens
        venda = Venda.objects.create(**validated_data)

        for item_data in itens_data:
            # Garante que o produto_id está presente
            if 'produto_id' not in item_data:
                raise serializers.ValidationError(
                    "O campo 'produto_id' é obrigatório para cada item."
                )
            produto = item_data['produto_id']
            quantidade = item_data['quantidade']
            preco_venda = item_data['preco_venda']
            ItemVenda.objects.create(venda=venda, produto=produto, quantidade=quantidade, preco_venda=preco_venda)

        venda.calcular_totais()  # Recalcular totais após criar todos os itens
        return venda
    

class ItemVendaCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para criar ItemVenda (usado dentro de VendaCreateSerializer).
    """
    produto = serializers.PrimaryKeyRelatedField(
        queryset=Produto.objects.all(),
        required=True
    )
    quantidade = serializers.IntegerField(min_value=1)
    preco_venda = serializers.DecimalField(
        max_digits=10, decimal_places=2, min_value=Decimal('0')
    )  # Validação

    class Meta:
        model = ItemVenda
        fields = ['produto', 'quantidade', 'preco_venda']

    def validate(self, data):
        """Valida a quantidade e o preço."""
        if data['quantidade'] <= 0:
            raise serializers.ValidationError(
                {"quantidade": "A quantidade deve ser maior que zero."}
            )
        if data['preco_venda'] <= 0:
            raise serializers.ValidationError(
                {"preco_venda": "O preço de venda deve ser maior que zero."}
            )
        return data

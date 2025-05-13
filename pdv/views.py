from rest_framework import viewsets, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from pdv.models import ItemVenda, Venda
from pdv.serializers import ItemVendaSerializer, VendaSerializer
from django.shortcuts import get_object_or_404


class VendaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para o modelo Venda.
    Fornece CRUD completo para vendas, com cálculo automático de totais.
    """
    queryset = Venda.objects.select_related('usuario').prefetch_related('itens').all()
    serializer_class = VendaSerializer

    def perform_create(self, serializer):
        """Sobrescreve para calcular totais após criação"""
        venda = serializer.save()
        venda.calcular_totais()

    def perform_update(self, serializer):
        """Sobrescreve para calcular totais após atualização"""
        venda = serializer.save()
        venda.calcular_totais()

    @action(detail=True, methods=['get'])
    def itens(self, request, pk=None):
        """Endpoint para listar itens de uma venda específica"""
        venda = self.get_object()
        itens = venda.itens.all()
        serializer = ItemVendaSerializer(itens, many=True)
        return Response(serializer.data)


class ItemVendaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para o modelo ItemVenda.
    Fornece CRUD completo para os itens de venda, com opções de filtrar por venda.
    """
    queryset = ItemVenda.objects.select_related('produto', 'venda').all()
    serializer_class = ItemVendaSerializer
    
    def get_queryset(self):
        """
        Retorna o queryset base, opcionalmente filtrado por venda_id.
        """
        queryset = self.queryset
        venda_id = self.request.query_params.get('venda_id')
        if venda_id:
            queryset = queryset.filter(venda_id=venda_id)
        return queryset

    def create(self, request, *args, **kwargs):
        """
        Cria um novo item de venda. Sobrescreve para garantir que a venda seja atualizada.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Atualiza os totais da venda associada
        item_venda = serializer.instance
        item_venda.venda.calcular_totais()

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)
    
    def update(self, request, *args, **kwargs):
        """
        Atualiza um item de venda existente. Sobrescreve para atualizar a venda.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Atualiza os totais da venda associada
        instance.venda.calcular_totais()
        
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """
        Exclui um item de venda. Sobrescreve para atualizar a venda.
        """
        instance = self.get_object()
        venda = instance.venda # Pega a venda antes de deletar o item
        self.perform_destroy(instance)
        
        # Atualiza os totais da venda associada
        venda.calcular_totais()
        return Response(status=204)
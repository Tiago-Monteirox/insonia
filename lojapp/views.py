# lojapp/views.py

# from django.shortcuts import render
# from .models import Produto


# def product_list(request):
#     produtos = Produto.objects.all()
#     return render(request, 'lojapp/product_list.html', {'produtos': produtos})


from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from lojapp.models import (
    Categoria, Marca, Produto,
    ProdutoImagem, NomeVariacao,
    ValorVariacao, Variacao
)
from lojapp.serializers import (
    CategoriaSerializer, MarcaSerializer,
    ProdutoSerializer, ProdutoCreateUpdateSerializer,
    ProdutoImagemSerializer, NomeVariacaoSerializer,
    ValorVariacaoSerializer, VariacaoSerializer
)


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class MarcaViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProdutoCreateUpdateSerializer
        return ProdutoSerializer

    @action(detail=True, methods=['post'])
    def adicionar_imagem(self,request, pk=None):
        produto = self.get_object()
        serializer = ProdutoImagemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(produto=produto)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class ProdutoImagemViewSet(viewsets.ModelViewSet):
    queryset = ProdutoImagem.objects.all()
    serializer_class = ProdutoImagemSerializer
    permission_classes = [permissions.IsAuthenticated]
    

class NomeVariacaoViewSet(viewsets.ModelViewSet):
    queryset = NomeVariacao.objects.all()
    serializer_class = NomeVariacaoSerializer
    permission_classes = [permissions.IsAuthenticated]


class ValorVariacaoViewSet(viewsets.ModelViewSet):
    queryset = ValorVariacao.objects.all()
    serializer_class = ValorVariacaoSerializer
    permission_classes = [permissions.IsAuthenticated]   

class VariacaoViewSet(viewsets.ModelViewSet):
    queryset = Variacao.objects.all()
    serializer_class = VariacaoSerializer
    permission_classes = [permissions.IsAuthenticated]
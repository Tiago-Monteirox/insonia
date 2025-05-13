from django.urls import path, include
from rest_framework.routers import DefaultRouter
from pdv.views import VendaViewSet, ItemVendaViewSet
from lojapp.views import (
    CategoriaViewSet, MarcaViewSet,
    ProdutoViewSet, ProdutoImagemViewSet,
    NomeVariacaoViewSet, ValorVariacaoViewSet,
    VariacaoViewSet
)

# Configurações dos routers
router = DefaultRouter()
router.register(r'vendas', VendaViewSet, basename='vendas')
router.register(r'itens-venda', ItemVendaViewSet, basename='itens-venda')
router.register(r'categorias', CategoriaViewSet, basename='categorias')
router.register(r'marcas', MarcaViewSet, basename='marcas')
router.register(r'produtos', ProdutoViewSet, basename='produtos')
router.register(r'produtos-imagem', ProdutoImagemViewSet, basename='produtos-imagem')
router.register(r'nome-variacao', NomeVariacaoViewSet, basename='nome-variacao')  
router.register(r'valor-variacao', ValorVariacaoViewSet, basename='valor-variacao')
router.register(r'variacao', VariacaoViewSet, basename='variacao')



urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('rest_framework.urls'))
]

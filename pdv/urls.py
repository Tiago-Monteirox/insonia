from rest_framework.routers import DefaultRouter
from .views import ItemVendaViewSet
from django.urls import path, include
from .admin import admin_site


router = DefaultRouter()
router.register(r'itens-venda', ItemVendaViewSet, basename='itemvenda')

urlpatterns = router.urls
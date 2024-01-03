from django.contrib import admin
from lojapp.models import Produto, Categoria

@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ('name', 'quantidade', 'preco_custo')  # Adicione 'quantidade' à lista de exibição
    list_editable = ('quantidade',)

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    list_editable = ('slug',)
    search_fields = ('name',)
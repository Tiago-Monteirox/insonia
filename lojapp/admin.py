from django.contrib import admin
from lojapp.models import Produto

@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ('name', 'quantidade', 'preco_custo')  # Adicione 'quantidade' à lista de exibição
    list_editable = ('quantidade',)
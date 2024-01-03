from django.contrib import admin
from django.utils.html import format_html
from lojapp.models import Produto, Categoria, ProdutoImagem
from lojapp.models import Marca

class ProdutoImagemInline(admin.TabularInline):
    model = ProdutoImagem
    extra = 1  # Número de campos de imagem extras
    max_num = 10 

@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ('name', 'quantidade', 'preco_custo', 'mostrar_primeira_imagem')  # Adicione 'quantidade' à lista de exibição
    list_editable = ('quantidade',)
    inlines = [ProdutoImagemInline]

    def mostrar_primeira_imagem(self, obj):
        primeira_imagem = obj.imagens.first()
        if primeira_imagem:
            return format_html('<img src="{}" style="width: 45px; height:45px;" />', primeira_imagem.imagem.url)
        return "Sem Imagem"
    mostrar_primeira_imagem.short_description = 'Imagem'

    
@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    list_editable = ('slug',)
    search_fields = ('name',)

@admin.register(Marca)
class MarcaAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    list_editable = ('slug',)
    search_fields = ('name',)

admin.site.register(ProdutoImagem)
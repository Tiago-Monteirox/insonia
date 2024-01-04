from django.contrib import admin
from django.utils.html import format_html
from lojapp.models import Produto, Categoria, ProdutoImagem
from lojapp.models import Marca,Variacao, NomeVariacao, ValorVariacao

class ProdutoImagemInline(admin.TabularInline):
    model = ProdutoImagem
    extra = 1  # Número de campos de imagem extras
    max_num = 10 

class VariacaoInline(admin.TabularInline):
    model = Variacao
    extra = 1
    min_num = 1
    max_num = 10

class ValorVariacaoInline(admin.TabularInline):
    model = ValorVariacao
    extra = 1
    max_num = 10


class ProdutoAdmin(admin.ModelAdmin):
    list_display = ('name', 'quantidade', 'preco_custo', 'mostrar_primeira_imagem')  # Adicione 'quantidade' à lista de exibição
    list_editable = ('quantidade',)
    inlines = [ProdutoImagemInline, VariacaoInline]

    def mostrar_primeira_imagem(self, obj):
        primeira_imagem = obj.imagens.first()
        if primeira_imagem:
            return format_html('<img src="{}" style="width: 45px; height:45px;" />', primeira_imagem.imagem.url)
        return "Sem Imagem"
    mostrar_primeira_imagem.short_description = 'Imagem'

    

class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    list_editable = ('slug',)
    search_fields = ('name',)


class MarcaAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    list_editable = ('slug',)
    search_fields = ('name',)


class NomeVariacaoAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    inlines = [ValorVariacaoInline]



# admin.site.register(ProdutoImagem)
# admin.site.register(ValorVariacao)

# admin.site.register(NomeVariacao, NomeVariacaoAdmin)
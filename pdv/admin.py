from django.contrib import admin
from .models import Venda, ItemVenda
from django.utils.html import format_html
from datetime import datetime

class ItemVendaInline(admin.TabularInline):
    model = ItemVenda
    extra = 1
    fields = ['produto', 'quantidade', 'valor_venda']

class VendaAdmin(admin.ModelAdmin):
    inlines = [ItemVendaInline]
    list_display = ('id', 'usuario', 'get_produtos', 'total_venda', 'lucro_total', 'data_venda')
    actions = ['mostrar_valor_total_vendas', 'mostrar_lucro_total_vendas']
    
    def get_produtos(self, obj):
        return ", ".join([item.produto.name for item in obj.itens_venda.all()])
    get_produtos.short_description = 'Produtos'

    # Adicione o total_venda à lista de exibição
    def total_venda(self, obj):
        return obj.total_venda
    total_venda.short_description = 'Total Venda'

    # Adicione o lucro à lista de exibição
    def lucro_total(self, obj):
        return obj.lucro_total
    lucro_total.short_description = 'Lucro Total'

    def mostrar_valor_total_vendas(self, request, queryset):
        total = Venda.calcular_valor_total_vendas()
        self.message_user(request, f"Valor total das vendas: {total}")
    mostrar_valor_total_vendas.short_description = "Mostrar valor total das vendas"

    def mostrar_lucro_total_vendas(self, request, queryset):
        lucro = Venda.calcular_lucro_total_vendas()
        self.message_user(request, f"Lucro total das vendas: {lucro}")
    mostrar_lucro_total_vendas.short_description = "Mostrar lucro total das vendas"

   
admin.site.register(Venda, VendaAdmin)
admin.site.register(ItemVenda)

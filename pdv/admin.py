from django.contrib import admin
from .models import Venda, ItemVenda

class ItemVendaInline(admin.TabularInline):
    model = ItemVenda
    extra = 1
    fields = ['produto', 'quantidade', 'valor_venda']

class VendaAdmin(admin.ModelAdmin):
    inlines = [ItemVendaInline]
    list_display = ('id', 'usuario', 'get_produtos', 'total_venda', 'lucro_total', 'data_venda')
    readonly_fields = ('total_venda', 'lucro_total')

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

   
admin.site.register(Venda, VendaAdmin)
admin.site.register(ItemVenda)

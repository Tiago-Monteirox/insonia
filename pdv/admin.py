from django.contrib import admin
from django.urls import path
from .models import Venda, ItemVenda
from django.utils.html import format_html
from .forms import DateRangeForm
from django.shortcuts import render
from lojapp.models import *



class MyAdminSite(admin.AdminSite):
    def get_app_list(self, request, app_label=None):
        app_list = super().get_app_list(request, app_label)

        for app in app_list:
            if app['app_label'] == 'lojapp':
                # Corrija esta lista para corresponder aos nomes exatos no Django Admin
                desired_order_lojapp = ['Produtos', 'Produto imagems', 'Categorias', 'Marcas', 'Nomes das Variações', 'Valores da Variações']
                app['models'].sort(key=lambda x: desired_order_lojapp.index(x['name']) if x['name'] in desired_order_lojapp else len(desired_order_lojapp))

            elif app['app_label'] == 'pdv':
                # Corrija esta lista da mesma forma, se necessário
                desired_order_pdv = ['Vendas', 'Item Vendas']
                app['models'].sort(key=lambda x: desired_order_pdv.index(x['name']) if x['name'] in desired_order_pdv else len(desired_order_pdv))

                # Adiciona 'Estatísticas' ao final da lista para 'pdv'
                app['models'].append({
                    'name': 'Estatísticas',
                    'admin_url': '/admin/pdv/venda/estatisticas/',
                    'view_only': True,
                })

        return app_list

    
admin_site = MyAdminSite(name='myadmin')

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

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('estatisticas/', self.admin_site.admin_view(self.estatisticas_view),
                 name='estatisticas'),
        ]
        return custom_urls + urls

    def estatisticas_view(self, request):
        context = {}
        
        if request.method == 'POST':
            form = DateRangeForm(request.POST)
            if form.is_valid():
                data_inicio = form.cleaned_data['data_inicio']
                data_fim = form.cleaned_data['data_fim']
                context['valor_total'] = Venda.calcular_valor_total_por_periodo(data_inicio, data_fim)
                context['lucro_total'] = Venda.calcular_lucro_total_por_periodo(data_inicio, data_fim)
        else:
            form = DateRangeForm()

        context['form'] = form
        return render(request, 'admin/estatisticas.html', context)


admin_site.register(Produto)

admin_site.register(ValorVariacao)

admin_site.register(NomeVariacao)

admin_site.register(ProdutoImagem)

admin_site.register(Venda, VendaAdmin)

admin_site.register(ItemVenda)

admin_site.register(Categoria)

admin_site.register(Marca)

admin.site = admin_site
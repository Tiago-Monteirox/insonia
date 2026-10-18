"""
URL configuration for insonia project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include  # Make sure you include this line
from graphene_django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView




urlpatterns = [
    path('', TemplateView.as_view(template_name='lojapp/product_list.html'), name='storefront'),
    path(
        'novidades/',
        TemplateView.as_view(
            template_name='lojapp/product_collection.html',
            extra_context={
                'active_nav': 'novidades',
                'collection_kicker': 'Novidades',
                'collection_title': 'Drop novo',
                'collection_description': 'Jaquetas, camisetas e cargos com silhueta slim para a primeira vitrine INSÔNIA.',
                'collection_label': 'Últimas peças adicionadas',
            },
        ),
        name='storefront_novidades',
    ),
    path(
        'calcados/',
        TemplateView.as_view(
            template_name='lojapp/product_collection.html',
            extra_context={
                'active_nav': 'calcados',
                'collection_kicker': 'Calçados',
                'collection_title': 'Tênis e shapes urbanos',
                'collection_description': 'Uma seleção escura, limpa e voltada para o uso diário no skatewear.',
                'collection_label': 'Base de calçados',
            },
        ),
        name='storefront_calcados',
    ),
    path(
        'roupas/',
        TemplateView.as_view(
            template_name='lojapp/product_collection.html',
            extra_context={
                'active_nav': 'roupas',
                'collection_kicker': 'Roupas',
                'collection_title': 'Roupas skatewear',
                'collection_description': 'Cortes retos, tons fechados e peças fáceis de combinar em looks noturnos.',
                'collection_label': 'Peças principais',
            },
        ),
        name='storefront_roupas',
    ),
    path(
        'acessorios/',
        TemplateView.as_view(
            template_name='lojapp/product_collection.html',
            extra_context={
                'active_nav': 'acessorios',
                'collection_kicker': 'Acessórios',
                'collection_title': 'Detalhes de rua',
                'collection_description': 'Bonés, bolsas e itens complementares para fechar a identidade da coleção.',
                'collection_label': 'Complementos do drop',
            },
        ),
        name='storefront_acessorios',
    ),
    path(
        'outlet/',
        TemplateView.as_view(
            template_name='lojapp/product_collection.html',
            extra_context={
                'active_nav': 'outlet',
                'collection_kicker': 'Outlet',
                'collection_title': 'Últimas peças',
                'collection_description': 'Produtos demonstrativos com preço de saída, mantendo a estética premium INSÔNIA.',
                'collection_label': 'Seleção outlet',
            },
        ),
        name='storefront_outlet',
    ),
    path(
        'minha-conta/',
        TemplateView.as_view(
            template_name='lojapp/customer_account.html',
            extra_context={'active_nav': 'conta'},
        ),
        name='storefront_minha_conta',
    ),
    path(
        'cadastro/',
        TemplateView.as_view(
            template_name='lojapp/customer_account.html',
            extra_context={'active_nav': 'conta'},
        ),
        name='storefront_cadastro',
    ),
    path(
        'meus-pedidos/',
        TemplateView.as_view(
            template_name='lojapp/customer_orders.html',
            extra_context={'active_nav': 'conta'},
        ),
        name='storefront_meus_pedidos',
    ),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True))),
    
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

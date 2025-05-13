import pytest
from lojapp.models import Categoria

@pytest.mark.django_db
class TestCategoria:
    def test_categoria_slug(self):
        categoria = Categoria.objects.create(name="Skates completos")
        assert categoria.slug == "skates-completos"

import pytest 
from lojapp.models import Marca

@pytest.mark.django_db
class TestMarca:
    def test_marca_slug(self):
        marca = Marca.objects.create(name="Santa Cruz")
        assert marca.slug == "santa-cruz"
        
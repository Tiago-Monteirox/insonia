# Generated by Django 5.0 on 2024-01-04 02:38

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lojapp', '0010_nomevariacao_alter_variacao_unique_together_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ValorVariacao',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('valor', models.CharField(max_length=50)),
            ],
            options={
                'verbose_name': 'Valor da Variação',
                'verbose_name_plural': 'Valores das Variações',
            },
        ),
        migrations.AlterField(
            model_name='variacao',
            name='valor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lojapp.valorvariacao'),
        ),
    ]

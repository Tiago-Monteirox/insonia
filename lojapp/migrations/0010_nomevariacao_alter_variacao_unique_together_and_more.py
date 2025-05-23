# Generated by Django 5.0 on 2024-01-03 04:30

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lojapp', '0009_rename_nome_variacao_name_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='NomeVariacao',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
            ],
            options={
                'verbose_name': 'Nome da Variação',
                'verbose_name_plural': 'Nomes das Variações',
            },
        ),
        migrations.AlterUniqueTogether(
            name='variacao',
            unique_together=set(),
        ),
        migrations.AddField(
            model_name='variacao',
            name='nome_variacao',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='lojapp.nomevariacao'),
        ),
        migrations.AlterUniqueTogether(
            name='variacao',
            unique_together={('produto', 'nome_variacao', 'valor')},
        ),
        migrations.RemoveField(
            model_name='variacao',
            name='name',
        ),
    ]

from django import forms

class DateRangeForm(forms.Form):
    data_inicio = forms.DateField(label='Data de Início')
    data_fim = forms.DateField(label='Data de Fim')
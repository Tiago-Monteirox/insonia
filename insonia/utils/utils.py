from datetime import datetime
import pytz

def parse_date(date_str):
    try:
        naive_date = datetime.strptime(date_str, '%Y-%m-%d')
        local_tz = pytz.timezone('America/Sao_Paulo')
        local_date = local_tz.localize(naive_date)
        return local_date
    except ValueError:
        raise ValueError("Data em formato incorreto. Use o formato AAAA-MM-DD.")

data_inicio = parse_date('2023-01-01')
data_fim = parse_date('2023-12-31')
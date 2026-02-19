import time
from datetime import datetime, timezone
import requests
import json
import pika
import os
from dotenv import load_dotenv

load_dotenv()

LATITUDE = float(os.getenv("LATITUDE"))
LONGITUDE= float(os.getenv("LONGITUDE"))
Intervalo = int(os.getenv("INTERVALO"))

RABBITMQ_URL = os.getenv("RABBITMQ_URL")
QUEUE_NAME = os.getenv("QUEUE_NAME")

def Buscar_Tempo():
    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={LATITUDE}&longitude={LONGITUDE}&current_weather=true"
        "&hourly=relativehumidity_2m,precipitation_probability,cloudcover,windspeed_10m"
    )

    resp = requests.get(url)
    resp.raise_for_status()

    data = resp.json()
    return data

def PegarDados(data):
    current = data.get("current_weather", {})
    hourly = data.get("hourly", {})

    current_time = current.get("time")
    times = hourly.get("time", [])
    try: 
        idx = times.index(current_time)
    except ValueError:
        idx = 0

    dados_log = {
        "Data_Hora" : datetime.now(timezone.utc).isoformat(),
        "Temperatura" : current.get("temperature"),
        "Umidade": hourly.get("relativehumidity_2m", [0])[idx] or 0,
        "Velocidade_Vento": current.get("windspeed"),
        "Condicoes_Chuva": hourly.get("cloudcover", [0])[idx] or 0,
        "Probabilidade_Chuva": hourly.get("precipitation_probability", [0])[idx] or 0,
    }

    print(json.dumps(dados_log, indent=2))

    return dados_log

def Mandar_RabbitMQ(mensagem: dict):
    params = pika.URLParameters(RABBITMQ_URL)
    conexao = pika.BlockingConnection(params)
    canal = conexao.channel()
    
    canal.queue_declare(queue=QUEUE_NAME, durable=True)
    body = json.dumps(mensagem)

    canal.basic_publish(
        exchange="",
        routing_key=QUEUE_NAME,
        body=body,
        properties = pika.BasicProperties(
            delivery_mode=2,
        )
    )
    
    print("Enviando mensagem para o RabbitMQ: ", body)
    conexao.close()

def main():
    while True:
        try:
            print("\n Buscando Tempo e Clima...")
            data = Buscar_Tempo() 

            print("\n Arruamando Dados... \n")
            Logs = PegarDados(data)

            print("\n Enviando pro RabbitMQ...")
            Mandar_RabbitMQ(Logs)
            
            print("Enviado com Sucesso")

        except requests.exceptions.RequestException as e:
            print("\n ERRO NA API:", e, "\n")

        except pika.exceptions.AMQPConnectionError as e:
            print("\n ERRO AO CONECTAR AO RABBITMQ:", e, "\n")

        except Exception as e:
            print("Erro Geral:", e)

        time.sleep(Intervalo)

if __name__ == "__main__":
    main()
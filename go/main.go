package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	amqp "github.com/rabbitmq/amqp091-go"
)

type Mensagem struct {
	DataHora    string   `json:"Data_Hora"`
	Temperatura *float64 `json:"Temperatura"`
	Umidade     *float64 `json:"Umidade"`
	VelVento    *float64 `json:"Velocidade_Vento"`
	CondChuva   *float64 `json:"Condicoes_Chuva"`
	ProbChuva   *float64 `json:"Probabilidade_Chuva"`
}

func val(v *float64) float64 {
	if v == nil {
		return 0
	}

	return *v
}

func main() {
	fmt.Println("Inicializando...")

	err := godotenv.Load()
	if err != nil {
		log.Println("Aviso: Arquivo .env com problemas")
	}

	rabbitURL := os.Getenv("RABBITMQ_URL")
	if rabbitURL == "" {
		println("Aviso: URL do rabbitmq com problemas no .env")
	}

	var conn *amqp.Connection

	for i := 0; i < 10; i++ {
		conn, err = amqp.Dial(rabbitURL)
		if err == nil {
			break
		}
		log.Println("Tentativa de conexão falhou, aguardando 2s...")
		time.Sleep(2 * time.Second)
	}

	if err != nil {
		log.Fatalf("Não foi possível conectar ao RabbitMQ: %v", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Erro ao abrir o canal %v", err)
	}
	defer ch.Close()

	QUEUENAME := os.Getenv("QUEUE_NAME")
	if QUEUENAME == "" {
		log.Println("Aviso: QUEUENAME com problemas no .env")
	}

	msgs, err := ch.Consume(
		QUEUENAME,
		"",
		true,
		false,
		false,
		false,
		nil,
	)

	if err != nil {
		log.Fatalf("Erro ao consumir o fila %v", err)
	}

	forever := make(chan bool)

	go func() {
		for d := range msgs {
			var m Mensagem
			if err := json.Unmarshal(d.Body, &m); err != nil {
				log.Println("ERRO as ler o JSON:", err)
				continue
			}

			fmt.Println("Recebendo:")
			fmt.Println("Data e Hora", m.DataHora)
			fmt.Println("Temperatura", val(m.Temperatura))
			fmt.Println("Velocidade do Vento", val(m.VelVento))
			fmt.Println("Umidade", val(m.Umidade))
			fmt.Println("Probabilidade de Chuva", val(m.ProbChuva))
			fmt.Println("Condicoes de Chuva", val(m.CondChuva))
		}
	}()

	<-forever
}

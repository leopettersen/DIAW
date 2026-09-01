# Clima RestAPI

API REST em Spring Boot que consulta a previsão do tempo atual de uma cidade, utilizando a [Open-Meteo API](https://open-meteo.com/) (geocoding + forecast).

## 🧑‍💻 Tecnologias utilizadas

- Java
- Spring Boot
- Spring Web (RestTemplate)
- Gson (parsing de JSON)
- Maven

## 📦 Dependências

- `spring-boot-starter-web`
- `com.google.code.gson:gson`

Todas as dependências estão declaradas no `pom.xml` e são baixadas automaticamente pelo Maven.

## 🔑 Configuração da API Key

Não é necessária nenhuma API Key. As APIs utilizadas (Open-Meteo Geocoding e Forecast) são públicas e gratuitas, sem autenticação.

## ▶️ Como executar localmente

### Pré-requisitos
- JDK 17 ou superior
- Maven (ou usar o wrapper `mvnw` incluso no projeto)

### Passos

1. Clone o repositório:
   ```bash
   git clone <https://github.com/leopettersen/DIAW/tree/main/PROJETOS/SpringBoot/Clima_RestAPI>
   cd Clima_RestAPI
   ```

2. Execute a aplicação:
   ```bash
   ./mvnw spring-boot:run
   ```
   No Windows:
   ```bash
   mvnw.cmd spring-boot:run
   ```

3. A aplicação estará disponível em:
   ```
   http://localhost:8080
   ```

## 🌐 Documentação dos endpoints

### `GET /clima/{city}`

Retorna um resumo do clima atual da cidade informada (caso nenhuma cidade seja informada o padrão será Belo Horizonte.)

**Parâmetro de caminho:**
| Nome | Tipo   | Descrição                          |
|------|--------|-------------------------------------|
| city | String | Nome da cidade a ser consultada     |

**Exemplo de requisição:**
```
GET http://localhost:8080/clima/Belo Horizonte
```

**Exemplo de resposta:**
```
----Resumo do clima em Belo Horizonte-----
Temperatura atual: 24.6°C
Humidade relativa do ar: 48.0%
Velocidade do vento: 1.6 Km/h
Direção do vento: 117.0°
Temperatura máxima: 29.2°C
Temperatura mínima: 18.1°C
Data e horario da consulta: 26/08/2026 09:23:21
```

## 📁 Estrutura do projeto

```
src/main/java/com/example/Clima_RestAPI/
├── application/       # Classe principal (main)
├── controller/         # Controllers REST
├── model/              # Classes utilizadas para tratamento de dados
└── service/             # Lógica de negócio e integração com Open-Meteo
```

# Projeto: API para Revenda de Veículos

## Visão Geral do Projeto

Este repositório contém o código-fonte do backend para uma plataforma de revenda de veículos online. A solução foi desenvolvida utilizando uma **arquitetura de microsserviços** para garantir a separação de responsabilidades, escalabilidade e manutenibilidade.

O projeto é composto por dois serviços principais:

* **`auth-service` (Serviço de Autenticação):** Responsável pelo ciclo de vida dos usuários, incluindo registro, login e geração de tokens de acesso (JWT).
* **`vehicle-service` (Serviço de Veículos):** Responsável por toda a lógica de negócio relacionada aos veículos, como cadastro, edição, listagem e o processo de compra.

## Arquitetura da Solução

A comunicação entre o cliente e os serviços, bem como a validação de rotas protegidas, segue o fluxo abaixo:

```
[ Cliente (Frontend/Postman) ]
       |
       | (1. Registra e/ou Loga)
       |--> [ auth-service (Porta 7001) ] --> [ Banco de Dados (auth_db) ]
       |      (Retorna um Token JWT)
       |
       | (2. Acessa rotas de veículos)
       | (3. Para comprar, envia o Token JWT)
       |--> [ vehicle-service (Porta 7000) ] --> [ Banco de Dados (vehicle_db) ]
              (Valida o Token JWT para autorizar a compra)
```

## Tecnologias Globais

* **Docker & Docker Compose**: Utilizados para criar um ambiente de desenvolvimento containerizado e orquestrar a execução de todos os serviços e bancos de dados de forma integrada.
* **Node.js com TypeScript**: Base tecnológica para a construção de ambos os microsserviços.
* **Prisma & PostgreSQL**: Stack de persistência de dados para ambos os serviços.

## Como Executar a Aplicação Completa

O método a seguir irá construir e executar os contêineres para ambos os microsserviços e seus respectivos bancos de dados.

### Pré-requisitos
* [Git](https://git-scm.com/)
* [Docker](https://www.docker.com/) e Docker Compose

### Passo 1: Clonar o Repositório
```bash
git clone https://github.com/BrunoADPaixao/tech-challenge-3-sub-veiculos.git
cd revenda-veiculos
```

### Passo 2: Configurar as Variáveis de Ambiente

Cada microsserviço possui seu próprio arquivo `.env` que precisa ser configurado. **Este é um passo crucial.**

1.  Navegue até a pasta `auth-service` e crie o arquivo `.env` conforme as instruções no `Readme.md` daquele serviço.
2.  Navegue até a pasta `vehicle-service` e crie o arquivo `.env` conforme as instruções no `Readme.md` daquele serviço.

> **Importante:** Garanta que a variável `JWT_SECRET` seja **exatamente a mesma** nos dois arquivos `.env`.

### Passo 3: Iniciar com Docker Compose

Na pasta raiz do projeto (`revenda-veiculos`), onde se encontra o arquivo `docker-compose.yml`, execute o seguinte comando:

```bash
docker-compose up --build
```

* O comando `--build` garante que as imagens Docker serão construídas a partir do código-fonte mais recente.
* Para rodar em segundo plano (detached mode), use: `docker-compose up --build -d`.

As migrações do banco de dados (`prisma migrate deploy`) serão executadas automaticamente na inicialização de cada serviço, conforme definido no `docker-compose.yml`.

### Passo 4: Acessando os Serviços

Após a inicialização, os serviços estarão disponíveis nos seguintes endereços:

* **Serviço de Autenticação:** `http://localhost:7001`
* **Serviço de Veículos:** `http://localhost:7000`

Para parar todos os contêineres, execute `docker-compose down` na pasta raiz.

## Próximos Passos

Para entender e testar os endpoints específicos de cada serviço, consulte os respectivos arquivos `Readme.md`:

* **[➡️ Readme do Serviço de Autenticação](./auth-service/Readme.md)**
* **[➡️ Readme do Serviço de Veículos](./vehicle-service/Readme.md)**
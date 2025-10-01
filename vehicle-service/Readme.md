# Microsserviço de Veículos - Plataforma de Revenda de Veículos

Este microsserviço é o coração da plataforma de revenda, responsável por gerenciar todo o ciclo de vida dos veículos. Suas funcionalidades incluem o cadastro, edição, listagem e o processo de compra de veículos.

Ele opera de forma independente, mas se comunica com o **Serviço de Autenticação** para validar a identidade dos compradores em rotas protegidas.

## Arquitetura e Tecnologias

Este projeto foi desenvolvido seguindo uma arquitetura de microsserviços, garantindo que os dados e as regras de negócio de veículos estejam isolados.

As tecnologias utilizadas foram:
* **Node.js**: Ambiente de execução JavaScript.
* **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
* **Express.js**: Framework para a construção da API REST.
* **Prisma**: ORM para interação com o banco de dados.
* **PostgreSQL**: Banco de dados relacional para persistência dos dados de veículos e vendas.
* **Docker & Docker Compose**: Para containerização e orquestração do ambiente de desenvolvimento.

## Como Executar Localmente

### Pré-requisitos
* [Node.js](https://nodejs.org/) (versão 18 ou superior)
* [Docker](https://www.docker.com/) e Docker Compose
* [Git](https://git-scm.com/)

### Configuração do Ambiente

1.  **Clone o repositório do projeto:**
    ```bash
    git clone https://github.com/BrunoADPaixao/tech-challenge-3-sub-veiculos.git
    cd vehicle-service
    ```

2.  **Crie o arquivo de variáveis de ambiente:**
    Crie um novo arquivo chamado `.env` na raiz do projeto e adicione as seguintes variáveis:

    ```env
    # URL de conexão com o banco de dados PostgreSQL
    # (Usuário:Senha@Host:Porta/NomeDoBanco) - Note a porta 5433 para não conflitar com o auth_db
    DATABASE_URL="postgresql://user:password@localhost:5433/vehicle_db?schema=public"

    # Chave secreta para validar os tokens JWT. DEVE SER IDÊNTICA à do auth-service.
    JWT_SECRET="SEU_SEGREDO_SUPER_SECRETO_AQUI"
    ```

### Executando a Aplicação

O método recomendado é executar toda a pilha de serviços através do Docker Compose no diretório raiz do projeto geral.

No entanto, para desenvolvimento focado neste serviço:

1.  **Instale as dependências:**
    ```bash
    npm install
    ```
2.  **Execute as migrações do banco de dados:**
    (Certifique-se de que o contêiner do banco de dados `vehicle_db` esteja rodando)
    ```bash
    npx prisma migrate dev
    ```
3.  **Inicie o servidor em modo de desenvolvimento:**
    ```bash
    npm run dev
    ```
    O servidor estará disponível em `http://localhost:7000`.

## Como Testar a API

Use uma ferramenta como Postman ou Insomnia para testar os endpoints.

---

### 1. Cadastrar Novo Veículo

* **Método:** `POST`
* **Endpoint:** `/vehicles`
* **URL Completa:** `http://localhost:7000/vehicles`

#### Corpo da Requisição (Body)
```json
{
    "brand": "Fiat",
    "model": "Mobi",
    "year": 2024,
    "color": "Vermelho",
    "price": 65000.00
}
```

---

### 2. Editar um Veículo

* **Método:** `PUT`
* **Endpoint:** `/vehicles/:id`
* **URL Completa:** `http://localhost:7000/vehicles/<ID_DO_VEICULO>`

#### Corpo da Requisição (Body)
```json
{
    "price": 64500.00
}
```
*Observação: Não é permitido editar um veículo já vendido.*

---

### 3. Comprar um Veículo (Rota Protegida)

* **Método:** `POST`
* **Endpoint:** `/vehicles/:id/buy`
* **URL Completa:** `http://localhost:7000/vehicles/<ID_DO_VEICULO>/buy`
* **Header Obrigatório:** `Authorization: Bearer <TOKEN_JWT_DO_USUARIO>`

---

### 4. Listar Veículos à Venda

* **Método:** `GET`
* **Endpoint:** `/vehicles/forsale`
* **URL Completa:** `http://localhost:7000/vehicles/forsale`

---

### 5. Listar Veículos Vendidos

* **Método:** `GET`
* **Endpoint:** `/vehicles/sold`
* **URL Completa:** `http://localhost:7000/vehicles/sold`
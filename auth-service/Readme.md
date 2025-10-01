# Microsserviço de Autenticação - Plataforma de Revenda de Veículos

Este microsserviço é responsável por gerenciar o cadastro (registro) e a autenticação (login) de usuários na plataforma de revenda de veículos. Sua principal função é validar as credenciais dos usuários e emitir tokens de acesso (JWT) que serão utilizados para proteger rotas em outros serviços, como o de veículos.

## Arquitetura e Tecnologias

Este projeto foi desenvolvido seguindo uma arquitetura de microsserviços, garantindo que as responsabilidades de autenticação estejam totalmente desacopladas do resto da solução.

As tecnologias utilizadas foram:
* **Node.js**: Ambiente de execução JavaScript.
* **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
* **Express.js**: Framework para a construção da API REST.
* **Prisma**: ORM para interação com o banco de dados.
* **PostgreSQL**: Banco de dados relacional para persistência dos dados de usuários.
* **JSON Web Tokens (JWT)**: Para geração de tokens de autenticação.
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
    cd auth-service
    ```

2.  **Crie o arquivo de variáveis de ambiente:**
    Crie um novo arquivo chamado `.env` na raiz do projeto e adicione as seguintes variáveis:

    ```env
    # URL de conexão com o banco de dados PostgreSQL
    # (Usuário:Senha@Host:Porta/NomeDoBanco)
    DATABASE_URL="postgresql://user:password@localhost:5432/auth_db?schema=public"

    # Chave secreta para assinar os tokens JWT. Deve ser longa e segura.
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
    (Certifique-se de que o contêiner do banco de dados `auth_db` esteja rodando)
    ```bash
    npx prisma migrate dev
    ```
3.  **Inicie o servidor em modo de desenvolvimento:**
    ```bash
    npm run dev
    ```
    O servidor estará disponível em `http://localhost:7001`.

## Como Testar a API

Use uma ferramenta como Postman ou Insomnia para testar os endpoints.

---

### 1. Registrar Novo Usuário

* **Método:** `POST`
* **Endpoint:** `/register`
* **URL Completa:** `http://localhost:7001/register`

#### Corpo da Requisição (Body)
```json
{
    "name": "Nome do Usuário",
    "email": "usuario@example.com",
    "password": "senha_forte_123"
}
```

#### Resposta de Sucesso (201 Created)
```json
{
    "id": "c1f7b5a3-8b1e-4b7e-8b1e-c1f7b5a38b1e",
    "name": "Nome do Usuário",
    "email": "usuario@example.com"
}
```

---

### 2. Autenticar Usuário (Login)

* **Método:** `POST`
* **Endpoint:** `/login`
* **URL Completa:** `http://localhost:7001/login`

#### Corpo da Requisição (Body)
```json
{
    "email": "usuario@example.com",
    "password": "senha_forte_123"
}
```

#### Resposta de Sucesso (200 OK)
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
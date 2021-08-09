# Desafio 2

API REST - Gerenciamento de Unidades Federativas, Estaduais e Municipais.

> **DISCLAMER** :warning: Neste projeto foi utilizado como banco de dados o MySQL, MySQL Workbenc para gerenciar e tratativa de erros..

O projeto foi construido utilizando **NodeJs**. Também foram utilizadas algumas bibliotecas: Express, Cors, mysql2, Bcrypt, body-parser, nodemon.

> Para conseguir execultar o projeto será necessario ter o **NodeJs** instalado, na versão **MAIS ATUAL**.

# Configurações iniciais

## Instalando dependencias

Antes de tudo precisamos instalar as dependências de nosso projeto. Na raiz do projeto execute o seguinte comando:

```bash
npm install
ou
yarn

```

## Configurando conexão com o Banco de Dados

Para aplicação foi utilizado o **MySQL**, suponhamos que já tem instalado, e configurado a rota 3306, localhost usuário e senha root e também ja tenha criado as tabela: pais com id automático, nome, sigla, tabela: estado, id automático, nome, uf, fk_id_pais, tabela: municipio, id automático, nome, população e fk_id_estado, tabela municipio: nome, população, fk_id_estado caso não, terá um imagem da lógica do bd logo abaixo e recria para continuar.

Na pasta raiz do projeto podemos encontrar um arquivo `nodemon.json`. Onde está guardada as informações de conexão.

```js
"env": {
  "MYSQL_USER":"root",
  "MYSQL_PASSWORD":"root", 
  "MYSQL_DATABASE":"mydb",
  "MYSQL_HOST": "localhost",
  "MYSQL_PORT": 3306
  }  
```

## Criando uma Build ou mod Dev

Basta executar o comando abaixo que será gerada iniciar a api

Na raiz do projeto execulte:

```bash
yarn dev
ou
npm start

```

não se preocupe com servidor no modo yarn utilizei o nodemon para que possa ficar escutando quando teclar para salva, o nodemon vai fazer o restart automático.

# Usando a API

Para poder visualizar e execultar as ações você pode utilizar o a ferramenta [Insomnia](https://insomnia.rest/).

Ao iniciar a aplicação ela estara disponível na porta **3000**. Você pode acessa-la apartir da seguinte url: [http://localhost:3000](http://localhost:3000).

## Criando uma conta

Para criar sua conta tenha criado no banco de dados tabela usuários com seguintes campos, id_usuario incrementação automática e key primary, email varchar(100) 
e ative como campo único, o próprio bd será responsável de validar isso., senha varchar(100) e ambos não pode ser null.
na rota **[/cadastro] (http://localhost:3000/usuarios)**
```js
{
  "email":"emailteste12@teste6.com",
	"senha":"123456"
}
```
o retorno será 
```js
{
  "mensagem": "Usuario cadastrado com sucesso",
  "usuarioCriado": {
    "id_usuario": 8,
    "email": "emailteste12@teste6.com"
  }
}
```
caso force cadastrar novamente receberá essa mensagem.
```js
{
  "mensagem": "Usuário já cadastrado 🚫"
}
```

## Fazendo Login 
Para fazer o login vá na rota **[/login] (http://localhost:3000/usuarios)** faça o login preenchendo os campos email e senha

```js
{
  "email":"emailteste5@teste6.com",
	"senha":"123456"
}
```
resposta da api será 
```js
{
  "mensagem": "Autenticado com sucesso 🔓",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c3VhcmlvIjo4LCJlbWFpbCI6ImVtYWlsdGVzdGUxMkB0ZXN0ZTYuY29tIiwiaWF0IjoxNjI4NDYzNjk4LCJleHAiOjE2Mjg0NjcyOTh9.Ylpc7rBOjrKlSYDl66c31rlus3pDSQfCcgfIaJDtZvc"
}
exibindo o token pega esse token e insira no auth modo Bearer Token, lembrando configurei o token para 1h de duração você pode mudar ao tempo que quiser no arquivo usuários const token.
```

## Rotas com autenticação são, **POST, DELETE, PATCH** rota get deixei pública. 


## Estado

É possivel listar, criar, atualizar e deletar as intâncias de estado.

<br/>

### Criação de Pais

Você pode acessar a rota: **[/pais](http://localhost:3000/pais)**, utilizando como método de requisição o **POST**.

Será necessário passar no corpo da requisição não se preocupa com id os seguintes dados:

```json
{
  "nome": "Brasil",
  "sigla": "BR"
}
```

<br/>

### Visualização de pais

Você pode acessar a rota: **[/pais](http://localhost:3000/pais)**, utilizando como método de requisição o **GET**. Trás uma variável de quantos paises cadastrado temos no banco de dados. com id preenchido automático.

```json
{
  "response": {
    "quantidade_de_pais": 5,
    "pais": [
      {
        "id": 5,
        "nome": "Brasil",
        "sigla": "BR"
      },
      {
        "id": 6,
        "nome": "Austrália",
        "sigla": "AU"
      },
      {
        "id": 7,
        "nome": "Argentina",
        "sigla": "AR"
      },
      {
        "id": 8,
        "nome": "Argentina",
        "sigla": "AR"
      },
      {
        "id": 9,
        "nome": "Japão",
        "sigla": "JP"
      }
    ]
  }
}
```

<br/>

## Visualização de pais por pesquisa

Você pode acessar a rota: **[/pais/id_do_pais](http://localhost:3000/pais/6)**, utilizando como método de requisição o **GET**. Trás um campo específco com esse id, tem aplicado no estado e municipio também.

```json
{
  "response": {
    "quantidade_de_pais": 5,
    "pais": [
      {
        "id": 6,
        "nome": "Austrália",
        "sigla": "AU"
      }
    ]
  }
}
```

<br/>

### Atualização de país

Você pode acessar a rota: **[/pais](http://localhost:3000/pais)** (`/pais + um json com id e os campos nome e siglas preenchidas já atualiza, os valores.`), utilizando como método de requisição o **PATCH**.

Será necessário passar no corpo da requisição os seguintes dados:

```json
{
  "id": 6,
  "nome": "Paquistão",
  "sigla": "PK"
}
```

e temos um retorno:

```json
"mensagem": "Objeto alterado com sucesso! 🌩"
```

<br/>

### Exclusão de país

Você pode acessar a rota: **[/pais](http://localhost:3000/pais)** (`/pais + um json com id do estado que deseja excluir.`), utilizando como método de requisição o **DELETE**. Passando apenas o id do país, e tem um msg de retorno.

<br/>

### Criação de estado

Você pode acessar a rota: **[/estado](http://localhost:3000/estado)**, utilizando como método de requisição o **POST**.

Será necessário o id do pais de vinculo no corpo da requisição:

```json
{
  "pais_id": 2,
  "nome": "Rondônia",
  "uf": "RO"
}
```

<br/>

### Demais tabelas

Estado, municipio tem CRUD, eles tem aplicado no body da requisição, uma url indicando seu ligamento, tem como melhorar mais por hora essa é a relação que pode aplicar visualmente ja no bando de dado utilizei fk no municipio e estado.

```json
{
"quantidade_de_estados": 5,
  "estados": [
    {
      "id": 2,
      "nome": "Rondônia",
      "uf": "RO",
      "request": {
        "description": "Veja vincolo do estado ao país.",
        "url": "http://localhost:3000/pais/5"
      }
    },
    {
      "id": 3,
      "nome": "Ilha Norfolk",
      "uf": "IN",
      "request": {
        "description": "Veja vincolo do estado ao país.",
        "url": "http://localhost:3000/pais/6"
      }
    },
    {
      "id": 4,
      "nome": "Ilha Norfolk",
      "uf": "IN",
      "request": {
        "description": "Veja vincolo do estado ao país.",
        "url": "http://localhost:3000/pais/6"
      }
    }
```

## Modelo da Banco de Dados

Modelo das tabelas do Banco de Dados.
![Modelo do Banco de Dados]
<img src="./src/img/diagramabd.png"></img>

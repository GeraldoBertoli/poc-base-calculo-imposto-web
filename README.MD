````markdown
# 🇧🇷 DeRE — Base de Cálculo

> Interface web para configuração e execução de fórmulas de **Base de Cálculo da DeRE (Declaração de Regimes Específicos)**.

![Angular](https://img.shields.io/badge/Angular-17-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Status](https://img.shields.io/badge/status-PoC-orange)
![API](https://img.shields.io/badge/API-Spring%20Boot-6DB33F?logo=springboot&logoColor=white)

---

## 📋 Sobre o projeto

O **DeRE — Base de Cálculo** é uma aplicação Angular desenvolvida como **Proof of Concept (PoC)** para configuração, manutenção e execução das regras utilizadas no cálculo das bases de cálculo da **Tabela 12 da DeRE**.

A aplicação funciona como uma camada visual sobre uma API REST desenvolvida em Spring Boot, utilizando **Spring Expression Language (SpEL)** para interpretação das fórmulas.

O objetivo principal é permitir que as regras de cálculo sejam configuradas de forma flexível, sem que cada alteração de regra exija uma mudança no código da aplicação.

### 🎯 Principais objetivos

- Centralizar as regras de cálculo das bases da DeRE.
- Permitir criação e manutenção das fórmulas de cálculo.
- Associar contas contábeis a códigos de tributação.
- Configurar variáveis utilizadas pelas fórmulas.
- Manter variáveis globais parametrizáveis.
- Executar os cálculos diretamente pela interface.
- Registrar e consultar a auditoria dos cálculos executados.

---

# 🏗️ Arquitetura

A solução é composta por duas aplicações:

```text
┌─────────────────────────────┐
│        Angular 17           │
│                             │
│  Dashboard                  │
│  Fórmulas                   │
│  Balancetes                 │
│  Cód. Tributação            │
│  Variáveis                  │
│  Variáveis Globais          │
│  Auditoria                  │
└──────────────┬──────────────┘
               │ HTTP/REST
               ▼
┌─────────────────────────────┐
│       Spring Boot API       │
│                             │
│  Spring Data REST           │
│  Spring EL (SpEL)           │
│  Regras de cálculo          │
│  Persistência               │
└─────────────────────────────┘
````

Durante o desenvolvimento, o Angular utiliza um **proxy** para encaminhar as requisições `/api/*` para a API local.

```text
Browser
   │
   │ http://localhost:4200/api/*
   ▼
Angular Dev Server
   │
   │ proxy
   ▼
http://localhost:8080/api/*
```

---

# 🚀 Funcionalidades

## 📊 Dashboard

Tela inicial com visão geral da aplicação e acesso rápido aos principais cadastros.

---

## 🧮 Fórmulas

Permite cadastrar e manter as fórmulas utilizadas no cálculo das bases da DeRE.

Cada fórmula possui:

| Campo           | Descrição                          |
| --------------- | ---------------------------------- |
| `codBc`         | Código da base de cálculo          |
| `expressaoSpel` | Expressão utilizada pelo Spring EL |

Exemplo:

```text
BC001
```

```text
variavelA + variavelB - variavelC
```

A aplicação também permite executar o cálculo de uma base diretamente pela interface.

---

## 🧾 Balancetes

Cadastro das contas contábeis utilizadas como origem dos valores para os cálculos.

Cada registro possui:

* Conta
* Saldo
* Código de tributação associado

O vínculo com o código de tributação é tratado separadamente pela API.

---

## 🏷️ Códigos de Tributação

Cadastro dos códigos de tributação utilizados pelas contas e variáveis de mapeamento.

Cada código possui:

```text
Código
Descrição
```

---

## 🔀 Variáveis de Mapeamento

Permite definir variáveis que serão utilizadas pelas fórmulas a partir de operações sobre os dados disponíveis.

Cada variável possui:

* Nome da variável
* Operação
* Código de tributação associado

Exemplo:

```text
Nome: receitaTributada
Operação: SUM
Código de tributação: XXXX
```

---

## 🌐 Variáveis Globais

Permite manter valores globais utilizados nas expressões SpEL.

Exemplo:

```text
Nome: ALIQUOTA_PADRAO
Valor: 0.035
```

Esses valores podem ser utilizados pelas fórmulas sem precisar duplicar constantes.

---

## 📜 Auditoria

A aplicação disponibiliza a consulta das execuções realizadas.

São registrados dados como:

* Código da base
* Variáveis utilizadas na entrada
* Resultado do cálculo
* Data/hora do processamento

Exemplo:

```text
Base: BC001
Resultado: 1.234.567,89
Processamento: 06/09/2026 01:30
```

---

# 🔌 Integração com a API

A aplicação foi desenvolvida para consumir a API localizada em:

```text
http://localhost:8080
```

Os principais endpoints utilizados são:

```text
GET    /api/formulas
POST   /api/formulas
PUT    /api/formulas/{id}
DELETE /api/formulas/{id}

GET    /api/balancetes
POST   /api/balancetes
PUT    /api/balancetes/{id}
DELETE /api/balancetes/{id}

GET    /api/codigos-tributacao
POST   /api/codigos-tributacao
PUT    /api/codigos-tributacao/{id}
DELETE /api/codigos-tributacao/{id}

GET    /api/variaveis-mapeamento
POST   /api/variaveis-mapeamento
PUT    /api/variaveis-mapeamento/{id}
DELETE /api/variaveis-mapeamento/{id}

GET    /api/global-variables
POST   /api/global-variables
PUT    /api/global-variables/{id}
DELETE /api/global-variables/{id}

POST   /api/calculo/{codBc}

GET    /api/calculo/auditoria
```

A API também disponibiliza endpoints específicos para os relacionamentos entre entidades e códigos de tributação.

---

# 🧠 Fórmulas com Spring EL

O motor de regras utiliza **Spring Expression Language (SpEL)**.

Isso permite armazenar as expressões como dados e avaliá-las durante a execução dos cálculos.

Exemplo simples:

```text
receita - deducoes
```

Exemplo com variável global:

```text
receita * ALIQUOTA_PADRAO
```

Exemplo de expressão composta:

```text
(receitaOperacional + receitaFinanceira) - deducoes
```

> A sintaxe efetivamente disponível depende das configurações e dos objetos expostos pela API.

---

# 🌎 Formatação brasileira

A interface utiliza o padrão brasileiro para apresentação dos valores numéricos:

```text
1.234,56
```

Em vez de:

```text
1,234.56
```

Valores monetários podem ser apresentados como:

```text
R$ 1.234,56
```

A formatação é somente visual e não altera os valores enviados para a API.

---

# 🛠️ Tecnologias

## Frontend

* Angular 17
* TypeScript
* Angular Router
* Angular HttpClient
* RxJS
* HTML
* CSS

## Backend

A aplicação foi projetada para integração com uma API baseada em:

* Java
* Spring Boot
* Spring Data REST
* Spring Expression Language (SpEL)

---

# 📦 Pré-requisitos

Antes de executar o projeto, tenha instalado:

* Node.js 18 ou superior
* npm
* Angular CLI 17
* API Spring Boot em execução na porta `8080`

Verifique:

```bash
node --version
npm --version
ng version
```

---

# ▶️ Executando o projeto

Clone ou extraia o projeto:

```bash
git clone <REPOSITORIO>
cd dere-app
```

Instale as dependências:

```bash
npm install
```

Execute:

```bash
npm start
```

A aplicação ficará disponível em:

```text
http://localhost:4200
```

O comando `npm start` utiliza o proxy configurado para encaminhar as chamadas da aplicação para:

```text
http://localhost:8080
```

---

# 🔧 Configuração do Proxy

O projeto possui um arquivo:

```text
proxy.conf.json
```

Responsável por encaminhar as requisições:

```text
/api/*
```

para:

```text
http://localhost:8080/api/*
```

Isso permite que o frontend utilize URLs como:

```text
/api/formulas
```

sem precisar colocar `localhost:8080` diretamente no código.

---

# 📁 Estrutura do projeto

```text
src/
├── app/
│   ├── core/
│   │   └── api.service.ts
│   │
│   ├── cadastros/
│   │   ├── balancetes/
│   │   ├── codigos-tributacao/
│   │   ├── formulas/
│   │   └── variaveis/
│   │
│   ├── dashboard/
│   │
│   ├── auditoria/
│   │
│   ├── shared/
│   │
│   ├── app.component.*
│   └── app.routes.ts
│
├── assets/
│
├── index.html
├── main.ts
└── styles.css

proxy.conf.json
package.json
tsconfig.json
```

---

# 🔄 Fluxo de cálculo

Um fluxo típico de utilização é:

```text
1. Cadastrar códigos de tributação
              ↓
2. Cadastrar balancetes
              ↓
3. Associar contas aos códigos
              ↓
4. Criar variáveis de mapeamento
              ↓
5. Configurar variáveis globais
              ↓
6. Criar fórmula da Base de Cálculo
              ↓
7. Executar cálculo
              ↓
8. Consultar resultado
              ↓
9. Consultar auditoria
```

---

# 🧪 Exemplo conceitual

Suponha a existência dos seguintes valores:

```text
Receita:      1.000.000,00
Deduções:       100.000,00
```

Uma fórmula poderia ser:

```text
receita - deducoes
```

Resultado:

```text
900.000,00
```

A mesma ideia pode ser expandida para fórmulas mais complexas, utilizando variáveis de mapeamento e valores globais.

---

# ⚠️ Status do projeto

Este projeto atualmente é uma **PoC (Proof of Concept)**.

O objetivo é validar principalmente:

* Modelo de configuração das regras
* Integração Angular + Spring Boot
* Utilização de SpEL
* Estrutura de cadastros
* Execução das fórmulas
* Auditoria dos cálculos

Antes de utilizar a solução em produção, devem ser avaliados aspectos como:

* Autenticação e autorização
* Controle de acesso
* Auditoria funcional
* Validação das expressões SpEL
* Segurança na execução das fórmulas
* Versionamento das regras
* Testes automatizados
* Tratamento de erros
* Observabilidade
* Performance
* Controle transacional
* Governança das alterações das regras

---

# 📌 Roadmap

Algumas evoluções naturais para a aplicação:

```text
[ ] Autenticação e autorização

[ ] Versionamento de fórmulas

[ ] Ativação/inativação de regras

[ ] Validação de expressões SpEL em tempo real

[ ] Testes de fórmula com valores informados pelo usuário

[ ] Visualização da árvore de dependências entre variáveis

[ ] Histórico de alterações das fórmulas

[ ] Comparação entre versões de uma fórmula

[ ] Importação/exportação de regras

[ ] Ambiente de homologação

[ ] Testes automatizados

[ ] Dashboard analítico dos cálculos

[ ] Gestão de permissões por funcionalidade
```

---

# 📄 API

A especificação OpenAPI da API pode ser utilizada para consultar os contratos disponíveis e gerar clientes ou documentação adicional.

Servidor:

```text
http://localhost:8080
```

---

# 👨‍💻 Desenvolvimento

Para iniciar o Angular em modo de desenvolvimento:

```bash
npm start
```

Para gerar o build:

```bash
npm run build
```

Para executar os testes:

```bash
npm test
```

---

# 📜 Licença

Projeto desenvolvido como **Proof of Concept** para avaliação e evolução da solução de cálculo da DeRE.

> **DeRE — Base de Cálculo**
> Configuração de regras. Execução de cálculos. Rastreabilidade.

```
```


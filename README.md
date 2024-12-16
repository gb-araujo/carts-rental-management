
# 🛒 Controle de Aluguel de Carrinhos

Este projeto foi criado para um evento com o objetivo de gerenciar o processo de aluguel de carrinhos. Ele oferece funcionalidades para registrar, acompanhar em tempo real e finalizar aluguéis de maneira prática e organizada, garantindo uma gestão eficiente.

---

## 🛠️ Tecnologias Utilizadas

- **Back-end:** Firebase (serverless)  
- **Banco de Dados:** NoSQL - Firestore Database  
- **Front-end:** ReactJS  
- **Controle de Versão:** Git e GitHub  

---

## 🚀 Como Rodar o Projeto

Siga os passos abaixo para configurar e executar o projeto localmente:

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/controle-aluguel-carrinhos.git
```

### 2. Configure o Firebase

- No arquivo de configuração (`firebaseConfig.js` ou similar), substitua os valores pelas credenciais do seu projeto Firebase.  
  Você pode encontrar essas informações no console do Firebase, na seção *Configurações do Projeto*.

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

export default firebaseConfig;
```

### 3. Instale as dependências

Execute o comando abaixo para instalar todas as dependências do projeto:

```bash
npm install
```

### 4. Inicie o projeto

Inicie o servidor de desenvolvimento com o comando:

```bash
npm start
```

O projeto será executado em `http://localhost:3000`.

---

## 📌 Observação

- Certifique-se de que o Firebase está devidamente configurado antes de rodar o projeto.
- Para utilizar todas as funcionalidades, habilite o Firestore Database no console do Firebase.

---

## Imagem da plataforma
![Plataforma](/plataforma.jpeg)

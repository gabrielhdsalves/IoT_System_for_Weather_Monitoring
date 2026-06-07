# 🌤️ Sistema IoT para Monitoramento Meteorológico

Bem-vindo ao **Sistema IoT para Monitoramento Meteorológico**! Este projeto é um sistema completo de ponta a ponta para capturar, armazenar e visualizar dados de temperatura e umidade. 

O ecossistema é composto por:
*   **Sensor (ESP32 + DHT11):** Coleta temperatura e umidade e envia os dados.
*   **Google Sheets (Banco de Dados / Apps Script):** Recebe os dados do sensor e serve como repositório simples e prático.
*   **Backend (Node.js + Express + TypeScript + Python):** Consome os dados da planilha e da API do *Weather.com* para integrar as medições locais e previsões, além de executar um script em Python para classificação de tipo de nuvem (Machine Learning).
*   **Frontend (React + Vite + Tailwind CSS):** Uma interface moderna e interativa para visualizar as leituras, gráficos de monitoramento em tempo real e realizar o envio de imagens para classificação de nuvens.

---

## 📁 Estrutura do Projeto

*   📂 `sensor/` - Código fonte para placas ESP32/ESP8266 na IDE do Arduino.
*   📂 `googleSheets/` - Script JavaScript do Google Apps Script que processa requisições HTTP da planilha.
*   📂 `backend/` - Servidor de API construído com Express, TypeScript e Python para IA.
*   📂 `frontend/` - Aplicação web feita em React (Vite) e estilizada com Tailwind CSS.

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo na ordem indicada para configurar e rodar cada parte do sistema:

### 1. Planilha do Google & Apps Script
1. Crie uma nova **Planilha Google**.
2. No menu superior da planilha, vá em **Extensões** > **Apps Script**.
3. Copie o código contido no arquivo `googleSheets/index.js` deste repositório e cole no editor do Apps Script.
4. Clique em **Implantar** (Deploy) > **Nova Implantação**.
5. Em "Selecionar tipo", escolha **App da Web**.
6. Defina quem tem acesso como **Qualquer pessoa** (ou *Anyone*).
7. Execute a implantação, autorize as permissões necessárias e **copie a URL gerada** (ela termina com `/exec`).

---

### 2. Sensor (ESP32)
1. Abra a IDE do Arduino.
2. Abra o arquivo `sensor/sensor.ino`.
3. Preencha as configurações de conexão com a sua rede e a URL do Apps Script:
   ```cpp
   const char* ssid = "NOME_DO_SEU_WIFI";
   const char* password = "SENHA_DO_SEU_WIFI";
   const char* serverName = "SUA_URL_DO_GOOGLE_APPS_SCRIPT";
   ```
4. Conecte a sua placa ESP32 ao computador, selecione a porta correta e clique em **Carregar** (Upload).

---

### 3. Servidor Backend

Você pode executar o servidor backend localmente ou utilizando o Docker (recomendado, pois gerencia automaticamente as dependências de Node.js, Python e o download do modelo de Machine Learning).

#### Opção A: Executando Localmente (Sem Docker)

1. **Requisitos de Python:**
   Certifique-se de ter o **Python 3.10+** instalado na sua máquina.
2. Abra o terminal na pasta `backend`:
   ```bash
   cd backend
   ```
3. Instale as dependências do Node.js e do Python:
   ```bash
   # Dependências do Node.js
   npm install

   # Dependências do Python (TensorFlow, Pillow, NumPy)
   pip install -r requirements.txt
   ```
4. Baixe o modelo de classificação de nuvens e coloque-o na pasta `backend/src/assets/`:
   * **Nome do arquivo:** `cloud_type_xception.keras`
   * **Link de Download:** [Baixar modelo cloud_type_xception.keras](https://drive.usercontent.google.com/download?id=10qGb5u7o1HDkZZW2hmYtf0OTxmWwsOa-&export=download&confirm=t)
   * *(Opcional)* Você pode baixar via linha de comando:
     ```bash
     # No Linux/macOS ou Git Bash:
     mkdir -p src/assets && curl -L -o src/assets/cloud_type_xception.keras "https://drive.usercontent.google.com/download?id=10qGb5u7o1HDkZZW2hmYtf0OTxmWwsOa-&export=download&confirm=t"
     ```
5. Copie o template de variáveis de ambiente e configure o `.env`:
   ```bash
   cp .env.example .env
   ```
   Abra o arquivo `.env` gerado e configure suas chaves e a rota do executável do Python (caso não esteja no PATH global como `python`):
   ```env
   PORT=3001
   GOOGLE="SUA_URL_DO_GOOGLE_APPS_SCRIPT"
   WEATHER_API_KEY="SUA_CHAVE_DO_WEATHER_API"
   PYTHON_PATH="python" # ou o caminho completo para o executável do Python
   ```
6. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   O backend estará rodando em `http://localhost:3001`.

#### Opção B: Executando com Docker (Recomendado)

O Dockerfile já realiza a instalação do Node.js, Python, pacotes do `requirements.txt` e faz o download automático do modelo de Machine Learning de 229MB.

1. Garanta que você configurou o arquivo `backend/.env` com as suas variáveis.
2. Crie e execute o container a partir da pasta raiz do projeto:
   ```bash
   # Build da imagem
   docker build -t iot-weather-backend ./backend

   # Executar o container
   docker run -p 3001:3001 --env-file ./backend/.env iot-weather-backend
   ```

---

### 4. Painel Frontend
1. Abra um novo terminal na pasta `frontend`:
   ```bash
   cd frontend
   ```
2. Instale as dependências do painel visual:
   ```bash
   npm install
   ```
3. Copie o template de variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
4. (Opcional) Verifique se o arquivo `.env` aponta corretamente para a URL da sua API local (por padrão já vem configurado):
   ```env
   VITE_API_BASE_URL=http://localhost:3001/api
   ```
5. Inicie o servidor do frontend:
   ```bash
   npm run dev
   ```
6. Clique no link que aparecer no terminal (geralmente `http://localhost:5173`) para abrir a interface em seu navegador!

---

## 🛠️ Tecnologias Utilizadas
*   **Microcontrolador:** ESP32 / ESP8266 (Linguagem C++)
*   **Banco de Dados:** Google Sheets com Google Apps Script
*   **Backend:** Node.js, Express, TypeScript, Axios
*   **Frontend:** React, Vite, TypeScript, Tailwind CSS, Lucide React

---

## 🎗️ Créditos e Referências

O modelo de classificação de nuvens utilizado neste projeto (`cloud_type_xception.keras`) foi baseado e gerado a partir do trabalho publicado no Kaggle:
* **Notebook de referência:** [Xception Cloud Classification por marytgm](https://www.kaggle.com/code/marytgm/xception-cloud-classification)


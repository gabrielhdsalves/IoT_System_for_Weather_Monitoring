FROM nikolaik/python-nodejs:python3.10-nodejs20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN npm run build

EXPOSE 3001
CMD ["npm", "start"]

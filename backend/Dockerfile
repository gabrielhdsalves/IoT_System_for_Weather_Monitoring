FROM nikolaik/python-nodejs:python3.10-nodejs20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN npm run build

RUN mkdir -p dist/assets && cp src/assets/cloud_type_xception.keras dist/assets/
RUN mkdir -p dist/services && cp src/services/evaluate_image.py dist/services/

EXPOSE 3001
CMD ["npm", "start"]

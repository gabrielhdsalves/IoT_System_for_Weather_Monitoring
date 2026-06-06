FROM nikolaik/python-nodejs:python3.10-nodejs20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN npm run build

RUN mkdir -p dist/assets && curl -L -o dist/assets/cloud_type_xception.keras "https://drive.usercontent.google.com/download?id=10qGb5u7o1HDkZZW2hmYtf0OTxmWwsOa-&export=download&confirm=t"
RUN mkdir -p dist/services && cp src/services/evaluate_image.py dist/services/

EXPOSE 3001
CMD ["npm", "start"]
